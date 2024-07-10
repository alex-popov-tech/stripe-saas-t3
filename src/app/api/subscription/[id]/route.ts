import { NextResponse } from "next/server";
import { stripe } from "~/utils/stripe";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const subId = params.id;

  try {
    await stripe.subscriptions.cancel(subId);
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
}
