import { useState, useContext, useMemo } from "react";
import { categories } from "../data/menu";
import { buildMenu } from "../data/menuStore";
import { canOrder } from "../data/shopStatus";
import DishCard from "../components/DishCard";
import { CartContext } from "../context/CartContext";
import { FavoritesContext } from "../context/FavoritesContext";

export default function MenuPage() {
  const [cat, setCat] = useState(categories[0]);
  const [favOnly, setFavOnly] = useState(false);
  const [q, setQ] = useState("");
  const { add } = useContext(CartContext);
  const { favs } = useContext(FavoritesContext);

  const all = useMemo(() => buildMenu(), []);
  const dishes = useMemo(
    () =>
      (favOnly ? all.filter((d) => favs.includes(d.id)) : all.filter((d) => d.cat === cat))
        .filter((d) => d.name.toLowerCase().includes(q.toLowerCase())),
    [all, cat, q, favOnly, favs]
  );

  return (
    <main className="px-4 pb-16">
      <img src="/img/banner.jpg" alt="Кафе-доставка МестоВстречи"
        className="w-full rounded-xl my-3 object-cover max-h-64"
        onError={(e) => (e.currentTarget.style.display = "none")} />

      {/* ✅ Баннер «Закрыто», как в оригинале */}
      {!canOrder() && (
        <div className="bg-stone-800 text-stone-200 rounded-xl p-6 text-center my-3">
          <p className="text-lg font-semibold">Закрыто</p>
          <p className="text-sm text-stone-400 mt-1">Вы сможете сделать заказ в рабочее время</p>
        </div>
      )}

      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по меню…"
        className="w-full my-3 px-4 py-2 rounded-full bg-brand-card border border-stone-700 focus:border-brand-yellow outline-none" />

      <div className="chips py-2">
        <button onClick={() => setFavOnly(true)}
          className={`chip shrink-0 px-4 py-2 rounded-full border bg-white text-stone-900 ${favOnly ? "border-2 border-red-500 font-semibold" : "border-stone-300"}`}>
          ❤ Избранное{favs.length > 0 ? ` (${favs.length})` : ""}
        </button>
        {categories.map((c) => (
          <button key={c} onClick={() => { setCat(c); setFavOnly(false); }}
            className={`chip shrink-0 px-4 py-2 rounded-full border bg-white text-stone-900 ${!favOnly && c === cat ? "border-2 border-stone-900 font-semibold" : "border-stone-300"}`}>
            {c}
          </button>
        ))}
      </div>

      {favOnly && dishes.length === 0 ? (
        <p className="text-stone-400 text-sm mt-6">
          В избранном пока пусто — нажми 🤍 на карточке блюда, и оно появится здесь.
        </p>
      ) : (
        <div className="dishes-grid mt-4" key={cat + String(favOnly)}>
          {dishes.map((d, i) => (
            <DishCard key={d.id} dish={d} onAdd={() => add(d)} style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      )}

      <img src="/img/banner2.jpg" alt="Доставка любимых блюд"
        className="w-full rounded-xl mt-8 object-cover"
        onError={(e) => (e.currentTarget.style.display = "none")} />
    </main>
  );
}