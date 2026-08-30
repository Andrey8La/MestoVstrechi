import { useContext, useRef } from "react";
import { menu } from "../data/menu";
import { CartContext } from "../context/CartContext";

export default function UpsellCarousel() {
  const { add } = useContext(CartContext);
  const ref = useRef(null);
  const drinks = menu.filter((d) => d.cat === "Напитки");
  const scroll = (dir) => ref.current.scrollBy({ left: dir * 260, behavior: "smooth" });

  return (
    <section className="mt-8">
      <h3 className="text-center text-lg mb-4">Что-то ещё?</h3>
      <div className="relative">
        <button type="button" onClick={() => scroll(-1)} className="absolute left-0 top-1/3 z-10 text-brand-yellow text-xl hover:scale-125 transition">◄</button>
        <div ref={ref} className="flex gap-3 overflow-x-auto px-8" style={{ scrollbarWidth: "none" }}>
          {drinks.map((d) => (
            <div key={d.id} className="dish-card shrink-0 w-40 bg-white rounded-lg overflow-hidden border border-stone-200">
              <img src={d.img} onError={(e) => (e.currentTarget.src = "/img/placeholder.svg")} className="h-32 w-full object-cover" alt={d.name} />
              <div className="p-2">
                <p className="text-sm text-stone-800">{d.name}</p>
                <button type="button" onClick={() => add(d)}
                  className="mt-2 w-full bg-brand-dark text-white rounded-md py-1.5 text-sm hover:bg-brand-yellow hover:text-black transition">
                  {d.price} ₽
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => scroll(1)} className="absolute right-0 top-1/3 z-10 text-brand-yellow text-xl hover:scale-125 transition">►</button>
      </div>
    </section>
  );
}