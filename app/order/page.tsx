"use client";
import CheckoutPage from "../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../context/CartContext"; // Assurez-vous d'importer le contexte du panier

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Order() {
  const { cartItems } = useCart(); // Récupérer les items du panier
  const total = cartItems.reduce((acc, item) => acc + item.price, 0); // Calculer le total

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Payez votre commande</h1>
      <h2 className="mt-4">Montant total: {total}€</h2> {/* Afficher le montant total */}

      <Elements stripe={stripePromise}>
      <CheckoutPage total={total} /> {/* Passer le total à CheckoutPage */}
      </Elements>
    </div>
  );
}
