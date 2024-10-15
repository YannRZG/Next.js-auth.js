"use client";
import CheckoutPage from "../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
export default function Contact() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>About</h1>
      <div>
        <h1>Payez votre commande</h1>
        <Elements stripe={stripePromise}>
          <CheckoutPage />
        </Elements>
      </div>
    </div>
  );
}
