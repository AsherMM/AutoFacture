import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover", // ✅ Stripe v20.x
});

// ✅ Gestion exclusive du POST
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, plan } = body;

    if (!userId || !plan) {
      return NextResponse.json({ error: "Missing userId or plan" }, { status: 400 });
    }

    // 🔹 Récupération de l’utilisateur depuis Supabase
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("email, stripe_customer_id")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      console.error("❌ User fetch failed:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔹 Vérifie ou crée le client Stripe
    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: userId },
      });

      customerId = customer.id;

      await supabase.from("users").update({ stripe_customer_id: customerId }).eq("id", userId);
    }

    // 🔹 Correspondance des plans → Price IDs (.env)
    const priceMap: Record<string, string> = {
      premium: process.env.STRIPE_PRICE_PREMIUM_MONTHLY_ID!,
      premium_yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY_ID!,
      pro: process.env.STRIPE_PRICE_PRO_MONTHLY_ID!,
      pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY_ID!,
    };

    const priceId = priceMap[plan];

    if (!priceId) {
      return NextResponse.json({ error: `Invalid plan: ${plan}` }, { status: 400 });
    }

    // 🔹 Crée la session de paiement (Stripe v20.x)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/abonnement?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/abonnement?canceled=true`,
      subscription_data: {
        metadata: {
          user_id: userId,
          plan,
        },
      },
      metadata: {
        user_id: userId,
        plan,
      },
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
    });

    // ✅ Retourne l’URL Checkout Stripe
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message || "Stripe Error" }, { status: 500 });
  }
}

// ❌ Bloque les autres méthodes HTTP
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
