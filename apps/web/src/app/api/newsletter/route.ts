import { z } from "zod";

// Writes the email straight into the HubSpot contacts database via the CRM
// Contacts API — no HubSpot form involved. Uses a private-app access token,
// which is a secret, so this must stay server-side (never expose to the client).
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

const bodySchema = z.object({
  email: z.email(),
});

export async function POST(request: Request) {
  if (!HUBSPOT_ACCESS_TOKEN) {
    console.error("HubSpot env var missing: set HUBSPOT_ACCESS_TOKEN.");
    return Response.json(
      { error: "Newsletter signup is not configured." },
      { status: 500 },
    );
  }

  let parsed;
  try {
    parsed = bodySchema.parse(await request.json());
  } catch {
    return Response.json(
      { error: "Voer een geldig e-mailadres in." },
      { status: 400 },
    );
  }

  const hsResponse = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: { email: parsed.email },
    }),
  });

  // 409 = a contact with this email already exists. For a newsletter signup
  // that's a success ("you're already on the list"), not an error.
  if (hsResponse.status === 409) {
    return Response.json({ ok: true, alreadyExists: true });
  }

  if (!hsResponse.ok) {
    const detail = await hsResponse.text();
    console.error("HubSpot contact create failed:", hsResponse.status, detail);
    return Response.json(
      { error: "Aanmelding mislukt. Probeer het later opnieuw." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
