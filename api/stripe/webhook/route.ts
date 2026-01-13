import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  try {
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId = session.metadata.user_id;
        const plan = session.metadata.plan;
        const subscriptionId = session.subscription;

        // Récupération de la souscription
        const sub: any = await stripe.subscriptions.retrieve(subscriptionId);
        const currentPeriodEnd = new Date(sub.current_period_end * 1000);

        await supabase
          .from("users")
          .update({
            subscription_plan: plan,
            subscription_status: sub.status,
            premium_until: currentPeriodEnd.toISOString(),
            stripe_customer_id: sub.customer,
          })
          .eq("id", userId);

        break;
      }

      case "customer.subscription.updated": {
        const sub: any = event.data.object;
        const currentPeriodEnd = new Date(sub.current_period_end * 1000);

        await supabase
          .from("users")
          .update({
            subscription_status: sub.status,
            premium_until: currentPeriodEnd.toISOString(),
          })
          .eq("stripe_customer_id", sub.customer);

        break;
      }

      case "customer.subscription.deleted": {
        const sub: any = event.data.object;

        await supabase
          .from("users")
          .update({
            subscription_plan: "free",
            subscription_status: "canceled",
            premium_until: null,
          })
          .eq("stripe_customer_id", sub.customer);

        break;
      }

      case "invoice.payment_failed": {
        const invoice: any = event.data.object;
        await supabase
          .from("users")
          .update({ subscription_status: "past_due" })
          .eq("stripe_customer_id", invoice.customer);
        break;
      }

      default:
        console.log(`ℹ️ Événement Stripe ignoré : ${event.type}`);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error: any) {
    console.error("❌ Webhook Stripe error:", error);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}
