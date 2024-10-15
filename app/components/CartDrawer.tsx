import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string; // Ajoutez userId ici
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, userId }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [cartId, setCartId] = useState<string | null>(null); // État pour stocker l'ID du panier
  const [error, setError] = useState<string | null>(null); // État pour gérer les erreurs

  // Récupérer les items du panier côté serveur au chargement
  useEffect(() => {
    const fetchCartItems = async () => {
      if (isOpen && userId) {
        try {
          const response = await fetch(`/api/cart?userId=${userId}`, { method: 'GET' });
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération du panier');
          }
          const data = await response.json();
          console.log("cartdata:",data);
          setCartItems(data?.items || []);
          setCartId(data?.cartId || null); // Récupérer l'ID du panier
        } catch (error) {
          console.error(error);
          setError('Erreur lors de la récupération du panier'); // Mise à jour de l'état d'erreur
        }
      }
    };

    fetchCartItems();
  }, [isOpen, userId]);

  // Fonction pour vider le panier
  const onClearCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }), // Passer userId ici
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du panier');
      }

      setCartItems([]); // Vider le panier localement
      setCartId(null); // Réinitialiser l'ID du panier
    } catch (error) {
      console.error(error);
      setError('Erreur lors de la suppression du panier'); // Mise à jour de l'état d'erreur
    }
  };

  // Calculer le total du panier
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className={`fixed right-0 top-0 w-80 bg-white h-full shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}>
      <h1 className="text-xl p-4 border-b">ID du Panier : {cartId}</h1> {/* Afficher l'ID du panier dans un h1 */}
      <h2 className="text-xl p-4 border-b">Panier</h2>
      <div className="p-4">
        {error && <p className="text-red-500">{error}</p>} {/* Afficher les erreurs */}
        {cartItems.length === 0 ? (
          <p>Le panier est vide.</p>
        ) : (
          <ul>
            {cartItems.map(item => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span>{item.description}</span>
                <span>{item.price}€</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="p-4 border-t">
          <h3 className="text-lg">Total: {total}€</h3>
        </div>
      )}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between">
        {cartItems.length > 0 && (
          <button 
            onClick={onClearCart}
            className="bg-red-500 text-white rounded px-4 py-2"
          >
            Vider le Panier
          </button>
        )}
        <button onClick={onClose} className="bg-gray-300 rounded px-4 py-2">
          Fermer
        </button>
        {cartItems.length > 0 && (
          <Link href="/order" className="bg-green-500 text-white rounded px-4 py-2 flex items-center justify-center">
            Valider
          </Link>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
