import { useContext } from "react";
import { CartContext } from "../context/CartContext";
export default function Header({ onOpenCart, onOpenZones, onOpenInfo }) {
  const { count, bump } = useContext(CartContext);
  const t = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Irkutsk" }));
  const m = t.getHours() * 60 + t.getMinutes();
  const open = m >= 600 && m <= 1375; // 10:00–22:55
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-brand-dark sticky top-0 z-40 border-b border-stone-800">
      <img src="/img/logo.png" onError={(e) => (e.currentTarget.src = "/img/logo.svg")} alt="МестоВстречи" className="h-11 w-11 rounded-md" />
      <div className="flex items-center gap-3 sm:gap-5">
        <a href="tel:+79041430202" className="hidden sm:block text-sm">+7 904 143 02 02</a>
        <button onClick={onOpenZones} title="Зоны доставки" className="hover:scale-110 transition">🗺</button>
        <button onClick={onOpenInfo} title="Информация о доставке" className="hover:scale-110 transition">ⓘ</button>
        <span className={`text-xs px-2 py-1 rounded-full ${open ? "bg-green-600" : "bg-red-600"}`}>{open ? "Открыто" : "Закрыто"}</span>
        <button onClick={onOpenCart} className="relative text-xl">🛒
          {count > 0 && <span className={`cart-count ${bump ? "bump" : ""} absolute -top-2 -right-2 bg-brand-yellow text-black text-xs rounded-full w-5 h-5 flex items-center justify-center`}>{count}</span>}
        </button>
      </div>
    </header>
  );
}