import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [count, setCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  return (
    <CartContext.Provider value={{ count, setCount, cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
}
