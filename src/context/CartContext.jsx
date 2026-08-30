import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  // ✅ при старте читаем корзину из localStorage (переживает F5 и закрытие браузера)
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });
  const [bump, setBump] = useState(false);

  // ✅ каждое изменение корзины сразу пишем в localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  const add = (d) => {
    setItems((p) =>
      p.find((i) => i.id === d.id)
        ? p.map((i) => (i.id === d.id ? { ...i, qty: i.qty + 1 } : i))
        : [...p, { ...d, qty: 1 }]
    );
    setBump(true);
    setTimeout(() => setBump(false), 350);
  };

  const change = (id, d) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i)));

  const remove = (id) => setItems((p) => p.filter((i) => i.id !== id));

  // после оформления заказа корзина очищается и в состоянии, и в хранилище
  const clear = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, add, change, remove, clear, count, total, bump }}>
      {children}
    </CartContext.Provider>
  );
}