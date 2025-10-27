export const runtime = "edge";
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const to = url.searchParams.get("to");
    if (!to) return new Response(JSON.stringify({ ok: false, error: "missing ?to" }), { status: 400 });
    const apiKey = process.env.SENDGRID_API_KEY;
    const from = process.env.DELIVERY_FROM_EMAIL || "no-reply@example.com";
    if (!apiKey) return new Response(JSON.stringify({ ok: false, error: "SENDGRID_API_KEY missing" }), { status: 500 });
    const body = {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from },
      subject: "POD Mail Test",
      content: [{ type: "text/plain", value: "This is a test email from production." }],
    };
    const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const ok = resp.status === 202;
    const text = await resp.text();
    return new Response(JSON.stringify({ ok, status: resp.status, body: text }), {
      status: ok ? 200 : 500,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
}
