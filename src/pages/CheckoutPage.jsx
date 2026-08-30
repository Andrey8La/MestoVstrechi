import { useState, useContext } from "react";
import { categories } from "../data/menu";
import { buildMenu } from "../data/menuStore";
import DishCard from "../components/DishCard";
import { CartContext } from "../context/CartContext";

export default function MenuPage() {
  const [cat, setCat] = useState(categories[0]);
  const [q, setQ] = useState("");
  const { add } = useContext(CartContext);

  // Меню клиента: база + добавленные в админке, с правками цены и скрытия
  const dishes = buildMenu().filter(
    (d) => d.cat === cat && d.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main className="px-4 pb-16">
      {/* Верхний фирменный баннер */}
      <img src="/img/banner.jpg" alt="Кафе-доставка МестоВстречи"
        className="w-full rounded-xl my-3 object-cover max-h-64"
        onError={(e) => (e.currentTarget.style.display = "none")} />

      {/* Поиск по меню */}
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по меню…"
        className="w-full my-3 px-4 py-2 rounded-full bg-brand-card border border-stone-700 focus:border-brand-yellow outline-none" />

      {/* Лента 12 категорий со скроллом */}
      <div className="chips py-2">
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`chip shrink-0 px-4 py-2 rounded-full border bg-white text-stone-900 ${c === cat ? "border-2 border-stone-900 font-semibold" : "border-stone-300"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Сетка карточек 1/2/3 колонки */}
      <div className="dishes-grid mt-4" key={cat}>
        {dishes.map((d, i) => (
          <DishCard key={d.id} dish={d} onAdd={() => add(d)} style={{ animationDelay: `${i * 0.05}s` }} />
        ))}
      </div>

      {/* Нижний баннер «Доставка любимых блюд» */}
      <img src="/img/banner2.jpg" alt="Доставка любимых блюд"
        className="w-full rounded-xl mt-8 object-cover"
        onError={(e) => (e.currentTarget.style.display = "none")} />
    </main>
  );
}