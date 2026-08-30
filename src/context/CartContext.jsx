import { createContext, useState } from "react";
export const CartContext = createContext();
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [bump, setBump] = useState(false);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  const add = (d) => {
    setItems((p) => p.find((i) => i.id === d.id) ? p.map((i) => i.id === d.id ? { ...i, qty: i.qty + 1 } : i) : [...p, { ...d, qty: 1 }]);
    setBump(true); setTimeout(() => setBump(false), 350);
  };
  const change = (id, d) => setItems((p) => p.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const remove = (id) => setItems((p) => p.filter((i) => i.id !== id));
  const clear = () => setItems([]);
  return <CartContext.Provider value={{ items, add, change, remove, clear, count, total, bump }}>{children}</CartContext.Provider>;
}