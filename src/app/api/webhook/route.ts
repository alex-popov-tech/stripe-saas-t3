import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "~/utils/stripe";
import { env } from "~/env";
import { handlers } from "./handlers";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature!,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: `Webhook Signature Verification Error: ${(error as Error).message}`,
      },
      { status: 400 },
    );
  }

  const handler: (event: Stripe.Event) => Promise<NextResponse> =
    // @ts-expect-error i don't want to write handlers for every event can you just shut up
    handlers[event.type];

  if (!handler) {
    return NextResponse.json(
      { message: `Unhandled event type: ${event.type}` },
      { status: 500 },
    );
  }

  return await handler(event);
}
