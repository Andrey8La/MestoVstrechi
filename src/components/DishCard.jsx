import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";

export default function DishCard({ dish, onAdd, style }) {
  const { isFav, toggle } = useContext(FavoritesContext);
  const fav = isFav(dish.id);

  return (
    <div className="dish-card bg-brand-card rounded-xl overflow-hidden flex" style={style}>
      <div className="flex-1 p-4">
        <h3 className="font-semibold">{dish.name}</h3>
        {dish.desc && <p className="text-sm text-stone-400 mt-1">{dish.desc}</p>}
        {dish.weight ? <p className="text-xs text-stone-500 mt-1">{dish.weight} гр.</p> : null}
        <div className="flex items-center justify-between mt-4">
          <span className="text-brand-yellow font-bold">{dish.price} ₽</span>
          <button onClick={onAdd} className="chip border border-stone-500 rounded-md px-2.5 py-1 hover:border-brand-yellow hover:text-brand-yellow">+</button>
        </div>
      </div>
      <div className="relative w-2/5">
        <img src={dish.img} alt={dish.name} loading="lazy"
          onError={(e) => (e.currentTarget.src = "/img/placeholder.svg")} className="w-full h-full object-cover" />
        <button onClick={() => toggle(dish.id)}
          title={fav ? "Убрать из избранного" : "В избранное"}
          className="absolute top-2 right-2 text-xl transition hover:scale-125">
          {fav ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
}