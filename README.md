# the-quiet-cost

## Static Email Signature Images

Files placed in `public/images/` are served as public static assets and can be referenced directly by URL without any import statements.

The email signature image lives at:

- `/images/quiet-cost-cover.jpg`
- `/images/quiet-cost-cover@2x.jpg`

Requirements:

- This image is used for email signatures.
- It must remain publicly accessible.
- Recommended max width: `120px` for email rendering.
- File size should stay under `200KB`.

## Protected Leads Dashboard

Guide request emails are stored in the `email_leads` table and can be viewed at `/api/leads-dashboard`.

This endpoint is protected with HTTP Basic Auth and requires:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

Do not expose these credentials publicly. Set them in Vercel before using the dashboard.
