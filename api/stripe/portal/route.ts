import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();

    const { data: user } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", user_id)
      .single();

    if (!user?.stripe_customer_id)
      return NextResponse.json({ error: "No Stripe customer" }, { status: 404 });

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/abonnement`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error("❌ Stripe portal error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
