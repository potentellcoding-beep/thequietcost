import postgres from "postgres";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_DATABASE_URL;

export const sql = connectionString
  ? postgres(connectionString, {
      ssl: "require",
      max: 1,
      idle_timeout: 5,
      connect_timeout: 10,
    })
  : null;

let tableReadyPromise;

export async function ensureLeadsTable() {
  if (!sql) {
    throw new Error(
      "DATABASE_URL or a Vercel POSTGRES_URL value must be configured.",
    );
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
