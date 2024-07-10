import { createClient } from "~/utils/supabase/server";
import type Stripe from "stripe";
import { NextResponse } from "next/server";

export const handlers = {
  ["checkout.session.completed"]: async (event: Stripe.Event) => {
    const supabase = createClient();
    const session = event.data?.object as Stripe.Checkout.Session;

    // userId passed from subscription route
    const userId = session.metadata?.userId;
    // customer: 'cus_QQXT2kemCZCstl',
    const customerId = session.customer as string;
    // subscription: 'sub_1PZgOr05aaltdvBb4Bi1aPgG',
    const subscriptionId = session.subscription as string;

    const { error } = await supabase.from("stripe_customers").upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      subscription_id: subscriptionId,
      plan_active: true,
      plan_expires: null,
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "success" }, { status: 200 });
  },
  ["customer.subscription.deleted"]: async (event: Stripe.Event) => {
    const supabase = createClient();
    const subscription = event?.data?.object as Stripe.Subscription;

    const { error } = await supabase
      .from("stripe_customers")
      .update({
        plan_active: false,
        subscription_id: null,
      })
      .eq("subscription_id", subscription.id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "success" }, { status: 200 });
  },
};
