import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { applyPromo } from "../data/promo";
import { useNavigate } from "react-router-dom";
export default function CartDrawer({ onClose }) {
  const { items, change, remove, total } = useContext(CartContext);
  const [code, setCode] = useState(""); const [discount, setDiscount] = useState(0); const [msg, setMsg] = useState("");
  const nav = useNavigate();
  const apply = () => { const d = applyPromo(code, total); if (d === null) { setMsg("Промокод не найден"); setDiscount(0); } else { setDiscount(d); setMsg(`Скидка ${d} ₽`); } };
  return (
    <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose}>
      <div className="cart-drawer absolute right-0 top-0 h-full w-full sm:w-96 bg-brand-card p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-brand-yellow">Корзина</h2>
          <button onClick={onClose} className="text-stone-400">✕</button>
        </div>
        {items.length === 0 && <p className="text-stone-400 text-sm">Корзина пуста</p>}
        {items.map((i) => (
          <div key={i.id} className="flex items-center gap-2 mb-3">
            <img src={i.img} onError={(e) => (e.currentTarget.src = "/img/placeholder.svg")} className="w-12 h-12 rounded object-cover" alt="" />
            <div className="flex-1 text-sm">{i.name}</div>
            <button onClick={() => change(i.id, -1)} className="border border-stone-600 rounded px-1.5">−</button>
            <span>{i.qty}</span>
            <button onClick={() => change(i.id, 1)} className="border border-stone-600 rounded px-1.5">+</button>
            <button onClick={() => remove(i.id)} className="text-stone-500">🗑</button>
          </div>
        ))}
        {items.length > 0 && (<>
          <div className="flex gap-2 my-3">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Промокод (MV10, MV200)" className="flex-1 px-3 py-2 rounded bg-brand-dark border border-stone-700 focus:border-brand-yellow outline-none" />
            <button onClick={apply} className="px-4 rounded border border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black transition">OK</button>
          </div>
          {msg && <p className="text-xs text-brand-yellow mb-2">{msg}</p>}
          <p className="font-bold">Итого: {Math.max(0, total - discount)} ₽</p>
          <button onClick={() => { onClose(); nav("/checkout"); }} className="mt-4 w-full bg-brand-yellow text-black font-bold py-3 rounded-full hover:opacity-90 transition">Оформить заказ</button>
        </>)}
      </div>
    </div>
  );
}