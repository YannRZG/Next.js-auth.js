// components/ProductCard.tsx
import React from 'react';
import { FaCartPlus } from "react-icons/fa6";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isInCart: boolean; 
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isInCart }) => {
  return (
    <div className="border rounded-lg p-4 m-2">
      <h2 className="font-bold text-xl">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-green-600 font-bold">{product.price}€</p>
      {!isInCart && ( // Afficher le bouton seulement si le produit n'est pas dans le panier
        <button 
          className="bg-blue-500 text-white rounded px-4 py-2 mt-2"
          onClick={() => onAddToCart(product)}
        >
         <FaCartPlus />
        </button>
      )}
    </div>
  );
};

export default ProductCard;
