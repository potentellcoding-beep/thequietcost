import { ensureLeadsTable, sql } from "./_lib/db.js";
import { requireBasicAuth } from "./_lib/basicAuth.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/New_York",
    }).format(new Date(value));
  } catch {
    return String(value);
  }
}

function renderDashboard(rows) {
  const tableRows = rows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.email)}</td>
          <td>${escapeHtml(row.source || "")}</td>
          <td>${escapeHtml(row.email_status || "")}</td>
          <td>${escapeHtml(formatDate(row.created_at))}</td>
          <td>${escapeHtml(formatDate(row.guide_sent_at))}</td>
        </tr>
      `,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>The Quiet Cost Leads</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #111417;
        --panel: #171b1f;
        --border: rgba(255,255,255,0.1);
        --text: #f4eadf;
        --muted: #b9b0a5;
        --accent: #bc4f3c;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 32px;
        background: radial-gradient(circle at top, rgba(188,79,60,0.18), transparent 28%), var(--bg);
        color: var(--text);
        font-family: Arial, sans-serif;
      }
      .wrap {
        max-width: 1100px;
        margin: 0 auto;
      }
      .panel {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 24px 60px rgba(0,0,0,0.25);
      }
      h1 {
        margin: 0 0 8px;
        font-size: 34px;
      }
      p {
        margin: 0;
        color: var(--muted);
      }
      .meta {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        margin: 24px 0;
      }
      .chip {
        border: 1px solid var(--border);
        border-radius: 999px;
        padding: 10px 14px;
        color: var(--muted);
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th, td {
        text-align: left;
        padding: 14px 12px;
        border-bottom: 1px solid var(--border);
        vertical-align: top;
      }
      th {
        color: var(--muted);
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      td {
        font-size: 14px;
      }
      a {
        color: var(--accent);
      }
      @media (max-width: 720px) {
        body { padding: 16px; }
        .panel { padding: 16px; }
        th, td { padding: 12px 8px; font-size: 13px; }
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="panel">
        <h1>Guide Requests</h1>
        <p>Protected with HTTP Basic Auth. This dashboard shows every recorded email submission for the free guide.</p>
        <div class="meta">
          <div class="chip">Total Leads: ${rows.length}</div>
          <div class="chip">Path: /api/leads-dashboard</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Source</th>
              <th>Status</th>
              <th>Created</th>
              <th>Guide Opened</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows || '<tr><td colspan="5">No leads recorded yet.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  </body>
</html>`;
}

export default async function handler(req, res) {
  if (!requireBasicAuth(req, res)) {
    return;
  }

  try {
    await ensureLeadsTable();

    const rows = await sql`
      select email, source, email_status, created_at, guide_sent_at
      from email_leads
      order by created_at desc
      limit 500;
    `;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(renderDashboard(rows));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load leads.";
    res.status(500).send(message);
  }
}
