import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { user_id, plan } = await req.json();

    if (!user_id || !plan)
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

    // Map plan → Price ID
    const prices: Record<string, string | undefined> = {
      premium_monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY_ID,
      premium_yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY_ID,
      pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY_ID,
      pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY_ID,
    };

    const priceId = prices[plan];
    if (!priceId)
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    // Récupérer le client Stripe depuis Supabase
    const { data: user } = await supabase
      .from("users")
      .select("stripe_customer_id, email")
      .eq("id", user_id)
      .single();

    let customerId = user?.stripe_customer_id;

    // Si pas encore de client Stripe → en créer un
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user?.email || undefined,
        metadata: { user_id },
      });
      customerId = customer.id;
      await supabase.from("users").update({ stripe_customer_id: customerId }).eq("id", user_id);
    }

    // Crée une session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/abonnement?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/abonnement?canceled=true`,
      subscription_data: {
        metadata: { user_id, plan },
      },
      metadata: { user_id, plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("❌ Stripe checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
