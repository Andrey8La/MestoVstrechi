import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function HistoryPanel() {
  const { add } = useContext(CartContext);
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-brand-yellow mb-4">История заказов</h1>
      {orders.length === 0 && <p className="text-stone-500">Заказов пока нет.</p>}
      {orders.map((o) => (
        <div key={o.id} className="bg-brand-card rounded-xl p-4 mb-3">
          <div className="flex justify-between">
            <p className="font-bold">№{String(o.id).slice(-4)} · {o.when}</p>
            <span className="text-xs px-2 py-1 rounded-full bg-stone-800 text-brand-yellow">{o.status}</span>
          </div>
          <p className="text-sm text-stone-400 mt-1">{o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}</p>
          <div className="flex justify-between items-center mt-2">
            <p className="font-bold text-brand-yellow">{o.sum} ₽</p>
            <button onClick={() => o.items.forEach((i) => add(i))}
              className="px-4 py-1.5 rounded-full border border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black transition">
              Повторить заказ
            </button>
          </div>
        </div>
      ))}
      <a href="/" className="text-brand-yellow underline">← Вернуться в меню</a>
    </main>
  );
}