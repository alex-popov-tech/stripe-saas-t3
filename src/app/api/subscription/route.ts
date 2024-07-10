import { stripe } from "~/utils/stripe";

export async function POST(request: Request) {
  const { userId, userEmail, items } = (await request.json()) as {
    userId: string;
    userEmail: string;
    items: { price: string; quantity: number }[];
  };

  const session = await stripe.checkout.sessions.create({
    success_url: `${request.headers.get("origin")}/user`,
    cancel_url: `${request.headers.get("origin")}/checkout/cancel`,
    mode: "subscription",
    line_items: items,
    metadata: { userId, userEmail },
    customer_email: userEmail,
    payment_method_types: ["card"],
  });

  return new Response(JSON.stringify({ sessionId: session.id }), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
