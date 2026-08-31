import Modal from "./Modal";
import { deliveryZones } from "../data/zones";

// 6 тарифных групп (таблица 2 отчёта)
const GROUPS = [
  { id: 1, min: 600, fee: 200, color: "from-emerald-500 to-emerald-600",
    zones: ["Хомутово (Барки)"] },
  { id: 2, min: 800, fee: 250, color: "from-sky-500 to-sky-600",
    zones: ["Хомутово (Грановщина)", "Хомутово (Западный)", "Хомутово (Северный)", "Грановщина", "Позднякова"] },
  { id: 3, min: 1300, fee: 350, color: "from-amber-500 to-amber-600",
    zones: ["Село Урик", "Куда (Кантри)", "Талька", "Горный"] },
  { id: 4, min: 1500, fee: 400, color: "from-orange-500 to-orange-600",
    zones: ["Урик (Замостье)", "Тургская", "Карлук", "Столбова"] },
  { id: 5, min: 2300, fee: 600, color: "from-rose-500 to-rose-600",
    zones: ["Ширяева", "Галки", "Зыкова", "Оёк", "Бутырки", "Коты", "Усть-Куда", "Московщина", "Лыловщина", "Тайтура", "Горяшина"] },
  { id: 6, min: 3300, fee: 1000, color: "from-fuchsia-500 to-fuchsia-600",
    zones: ["Мишонкова", "Егоровщина", "Сосновый Бор", "Жердовка", "Черемушки", "Максимовщина", "Ревякина", "Каштак", "Бургаз"] },
];

// страховка: зоны из справочника, не попавшие в группы
const covered = new Set(GROUPS.flatMap((g) => g.zones));
const uncovered = deliveryZones.filter((z) => !covered.has(z.name));
if (uncovered.length > 0) console.warn("⚠ Зоны не в группах:", uncovered.map((z) => z.name));

export default function ZonesModal({ onClose }) {
  return (
    <Modal title="Зоны доставки (34 зоны, 6 групп)" onClose={onClose}>
      <p className="text-sm text-stone-300 mb-4">
        Чем дальше зона от кафе (с. Хомутово, ул. Мичурина, 1Б), тем выше минимальная сумма заказа и стоимость платной доставки.
      </p>

      {/* ✅ МОБИЛЬНЫЙ: горизонтальная лента со snap-скроллом; ДЕСКТОП: сетка 2–3 колонки */}
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x md:grid md:grid-cols-2 xl:grid-cols-3 md:overflow-visible md:pb-0">
        {GROUPS.map((g) => (
          <div key={g.id}
            className="snap-start shrink-0 w-[240px] sm:w-[260px] md:w-auto bg-brand-dark rounded-xl overflow-hidden border border-stone-700">
            {/* шапка группы */}
            <div className={`bg-gradient-to-r ${g.color} px-3 py-2.5 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-black/30 text-white font-bold flex items-center justify-center text-sm">{g.id}</span>
                <div>
                  <p className="text-white font-bold text-sm">Группа {g.id}</p>
                  <p className="text-white/80 text-[10px]">удалённость растёт →</p>
                </div>
              </div>
            </div>
            {/* тариф + зоны чипами с переносом */}
            <div className="px-3 py-2.5 flex flex-wrap gap-1.5">
              <span className="bg-white/95 text-stone-900 text-[11px] font-bold px-2 py-0.5 rounded-full">от {g.min} ₽</span>
              <span className="bg-black/40 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">платно {g.fee} ₽</span>
              {g.zones.map((z) => (
                <span key={z} className="px-2 py-0.5 rounded-full bg-brand-card text-xs text-stone-200 border border-stone-700">
                  {z}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-stone-800/60 text-xs text-stone-300">
        <p className="font-bold text-brand-yellow mb-1">📌 Правило расчёта</p>
        <p>При заказе свыше минимальной суммы группы — доставка <b className="text-white">бесплатно</b>.</p>
        <p>Ниже порога — платная доставка по тарифу группы.</p>
      </div>
    </Modal>
  );
}