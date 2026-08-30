import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Header({ onOpenCart, onOpenZones, onOpenInfo }) {
  const { count, bump } = useContext(CartContext);

  // Индикатор «Открыто/Закрыто» по часам работы 10:00–22:55 (Asia/Irkutsk)
  const t = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Irkutsk" }));
  const m = t.getHours() * 60 + t.getMinutes();
  const open = m >= 600 && m <= 1375;

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-brand-dark sticky top-0 z-40 border-b border-stone-800">
      <a href="/" className="flex items-center gap-2">
        <img src="/img/logo.png" onError={(e) => (e.currentTarget.src = "/img/logo.svg")}
          alt="МестоВстречи" className="h-11 w-11 rounded-md" />
      </a>

      <div className="flex items-center gap-3 sm:gap-5">
        <a href="tel:+79041430202" className="hidden sm:block text-sm hover:text-brand-yellow transition">+7 904 143 02 02</a>

        {/* История заказов */}
        <Link to="/history" title="История заказов" className="hover:scale-110 transition">📜</Link>

        {/* Зоны доставки */}
        <button onClick={onOpenZones} title="Зоны доставки" className="hover:scale-110 transition">🗺</button>

        {/* Информация о доставке */}
        <button onClick={onOpenInfo} title="Информация о доставке" className="hover:scale-110 transition">ⓘ</button>

        {/* Индикатор работы */}
        <span className={`text-xs px-2 py-1 rounded-full ${open ? "bg-green-600" : "bg-red-600"}`}>
          {open ? "Открыто" : "Закрыто"}
        </span>

        {/* Корзина со счётчиком и bump-анимацией */}
        <button onClick={onOpenCart} className="relative text-xl hover:scale-110 transition">🛒
          {count > 0 && (
            <span className={`cart-count ${bump ? "bump" : ""} absolute -top-2 -right-2 bg-brand-yellow text-black text-xs rounded-full w-5 h-5 flex items-center justify-center`}>
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}