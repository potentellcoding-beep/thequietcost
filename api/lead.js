import postgres from "postgres";

const sql = process.env.DATABASE_URL
  ? postgres(process.env.DATABASE_URL, {
      ssl: "require",
      max: 1,
      idle_timeout: 5,
      connect_timeout: 10,
    })
  : null;

let tableReadyPromise;

function getOrigin(req) {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${protocol}://${host}`;
}

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(body));
}

async function ensureTable() {
  if (!sql) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!tableReadyPromise) {
    tableReadyPromise = sql`
      create table if not exists email_leads (
        id bigserial primary key,
        email text not null unique,
        source text,
        guide_url text,
        email_status text default 'pending',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        guide_sent_at timestamptz
      );
    `;
  }

  await tableReadyPromise;
}

async function sendGuideEmail({ email, guideUrl }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.GUIDE_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error(
      "RESEND_API_KEY and GUIDE_FROM_EMAIL must be configured to send the guide email.",
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Your free guide: 17 Signs Your Child May Be Experiencing Parental Alienation",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#161616;max-width:640px;margin:0 auto;padding:24px;">
          <h1 style="font-size:28px;line-height:1.1;margin-bottom:16px;">Your free guide is ready.</h1>
          <p>Here is your download:</p>
          <p style="margin:24px 0;">
            <a href="${guideUrl}" style="display:inline-block;padding:14px 22px;background:#bc4f3c;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:700;">
              Read the Free Guide
            </a>
          </p>
          <p>If the button does not work, copy and paste this link into your browser:</p>
          <p><a href="${guideUrl}">${guideUrl}</a></p>
          <hr style="border:none;border-top:1px solid #e5ded5;margin:32px 0;" />
          <p style="color:#5a514a;">You requested <strong>17 Signs Your Child May Be Experiencing Parental Alienation</strong> from The Quiet Cost.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }

  try {
    const { email, source = "free-guide-form" } = req.body || {};

    if (!email || typeof email !== "string") {
      return json(res, 400, { error: "A valid email is required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return json(res, 400, { error: "A valid email is required." });
    }

    await ensureTable();

    const origin = getOrigin(req);
    const guideUrl =
      process.env.FREE_GUIDE_URL || `${origin}/free-guide.html`;

    await sql`
      insert into email_leads (email, source, guide_url, email_status)
      values (${normalizedEmail}, ${source}, ${guideUrl}, 'pending')
      on conflict (email)
      do update set
        source = excluded.source,
        guide_url = excluded.guide_url,
        email_status = 'pending',
        updated_at = now();
    `;

    await sendGuideEmail({ email: normalizedEmail, guideUrl });

    await sql`
      update email_leads
      set
        email_status = 'sent',
        guide_sent_at = now(),
        updated_at = now()
      where email = ${normalizedEmail};
    `;

    return json(res, 200, {
      ok: true,
      message: "The guide has been sent to your inbox.",
    });
  } catch (error) {
    console.error("Lead capture failed:", error);

    const message =
      error instanceof Error ? error.message : "Failed to deliver guide.";

    return json(res, 500, {
      error: message,
    });
  }
}
