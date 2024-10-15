"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  total: number; // Prop pour le montant total
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentStatus, setPaymentStatus] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: total * 100, userId: "USER_ID_HERE" }), // Le montant est en centimes
    });

    if (!res.ok) {
      const errorMessage = await res.text();
      setPaymentStatus("Error: " + errorMessage);
      return;
    }

    const { clientSecret } = await res.json();

    if (!clientSecret) {
      setPaymentStatus("Error: client_secret is missing");
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement!,
      },
    });

    if (result.error) {
      setPaymentStatus("Error: " + result.error.message);
    } else {
      setPaymentStatus("Payment successful!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 w-[80vw] max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-center">Checkout</h2>
      <CardElement 
        options={{ 
          style: { 
            base: { 
              fontSize: '16px', 
              color: '#000',
              '::placeholder': {
                color: '#aab7c4',
              }
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a',
            },
          } 
        }} 
      />
      <button 
        type="submit" 
        disabled={!stripe} 
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
      >
        Pay
      </button>
      {paymentStatus && <div className="text-red-500 text-center">{paymentStatus}</div>}
    </form>
  );
}

export default function CheckoutPage({ total }: { total: number }) { // Recevoir le montant total comme prop
  return (
    <div className="flex items-center justify-center bg-gray-100">
      <Elements stripe={stripePromise}>
        <CheckoutForm total={total} /> {/* Passer le montant total */}
      </Elements>
    </div>
  );
}
