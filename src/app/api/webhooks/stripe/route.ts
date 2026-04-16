import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await req.text(); // body read for constructEvent when Stripe Phase 3 is enabled
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // TODO: Phase 3 — uncomment when Stripe is fully configured
  // import { stripe } from "@/lib/stripe.service";
  //
  // let event: Stripe.Event;
  // try {
  //   event = stripe.webhooks.constructEvent(
  //     body,
  //     signature,
  //     process.env.STRIPE_WEBHOOK_SECRET
  //   );
  // } catch (err) {
  //   const message = err instanceof Error ? err.message : "Unknown error";
  //   console.error(`Webhook signature verification failed: ${message}`);
  //   return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  // }
  //
  // switch (event.type) {
  //   case "checkout.session.completed":
  //     // Grant access after successful purchase
  //     break;
  //   case "customer.subscription.updated":
  //     // Handle plan changes, trial end
  //     break;
  //   case "customer.subscription.deleted":
  //     // Revoke access
  //     break;
  //   case "invoice.payment_succeeded":
  //     // Extend subscription period
  //     break;
  //   case "invoice.payment_failed":
  //     // Alert user, mark account as past_due
  //     break;
  //   default:
  //     console.log(`Unhandled event type: ${event.type}`);
  // }

  return NextResponse.json({ received: true }, { status: 200 });
}
