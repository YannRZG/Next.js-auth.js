// context/CartContext.tsx
"use client";

import { createContext, useState, ReactNode, useContext } from "react";

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCartItems((prev) => [...prev, product]);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart, isCartOpen, setCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};
