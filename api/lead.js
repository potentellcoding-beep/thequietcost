import { ensureLeadsTable, sql } from "./_lib/db.js";

function getOrigin(req) {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${protocol}://${host}`;
}

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(body));
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

    await ensureLeadsTable();

    const origin = getOrigin(req);
    const guideUrl =
      process.env.FREE_GUIDE_URL ||
      `${origin}/guides/17-signs-of-parental-alienation.pdf`;

    await sql`
      insert into email_leads (email, source, guide_url, email_status)
      values (${normalizedEmail}, ${source}, ${guideUrl}, 'opened')
      on conflict (email)
      do update set
        source = excluded.source,
        guide_url = excluded.guide_url,
        email_status = 'opened',
        guide_sent_at = now(),
        updated_at = now();
    `;

    return json(res, 200, {
      ok: true,
      guideUrl,
      message: "Your request has been recorded. Opening the guide now.",
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
