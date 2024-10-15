"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import CartDrawer from "./CartDrawer";
import { IoCart } from "react-icons/io5";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface ProductsPageProps {
  userId: string | null; // Recevoir l'ID utilisateur en props
}

const ProductsPage: React.FC<ProductsPageProps> = ({ userId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = async (product: Product) => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    const existingItem = cartItems.find((item) => item.id === product.id);
    if (!existingItem) {
      setCartItems([...cartItems, product]);
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId: product.id, quantity: 1 }),
        });
      } catch (error) {
        console.error("Erreur lors de l'ajout au panier :", error);
      }
    } else {
      console.log("Le produit est déjà dans le panier");
    }
  };

  const handleClearCart = async () => {
    if (!userId) return;
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setCartItems([]); // Vider le panier localement
    } catch (error) {
      console.error("Erreur lors du vidage du panier :", error);
    }
  };

  return (
    <div>
      <button
        onClick={() => setCartOpen(true)}
        className="fixed top-24 right-8 bg-blue-500 text-white rounded px-4 py-2"
      >
        <IoCart />
        {cartItems.length > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            isInCart={cartItems.some((item) => item.id === product.id)}
          />
        ))}
      </div>
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        userId={userId}
        cartItems={cartItems}
        onClearCart={handleClearCart}
      />
    </div>
  );
};

export default ProductsPage;
