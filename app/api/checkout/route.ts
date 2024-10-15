import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/src/lib/prisma";  // Chemin vers l'instance Prisma

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-09-30.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const { amount, userId } = await req.json();
    console.log("Received request:", { amount, userId }); // Log des données reçues

    // Vérification que le montant est un nombre valide
    if (isNaN(amount) || amount <= 0) {
      console.error("Invalid amount:", amount);
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Vérification que userId est valide
    if (!userId) {
      console.error("Missing userId");
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur", // Correction de la devise
      automatic_payment_methods: { enabled: true },
    });

    console.log("PaymentIntent created:", paymentIntent); // Log du PaymentIntent créé

    // Enregistre le paiement dans Prisma
    await prisma.payment.create({
      data: {
        amount,
        status: "pending",
        userId,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error); // Log de l'erreur
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
