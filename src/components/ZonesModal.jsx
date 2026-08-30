import Modal from "./Modal";
import { deliveryZones } from "../data/zones";

// 6 тарифных групп (как в таблице 2 отчёта) с цветами для визуального разделения
const GROUPS = [
  {
    id: 1, min: 600, fee: 200, color: "from-emerald-500 to-emerald-600", ring: "ring-emerald-400",
    zones: ["Хомутово (Барки)"],
  },
  {
    id: 2, min: 800, fee: 250, color: "from-sky-500 to-sky-600", ring: "ring-sky-400",
    zones: ["Хомутово (Грановщина)", "Хомутово (Западный)", "Хомутово (Северный)", "Грановщина", "Позднякова"],
  },
  {
    id: 3, min: 1300, fee: 350, color: "from-amber-500 to-amber-600", ring: "ring-amber-400",
    zones: ["Село Урик", "Куда (Кантри)", "Талька", "Горный"],
  },
  {
    id: 4, min: 1500, fee: 400, color: "from-orange-500 to-orange-600", ring: "ring-orange-400",
    zones: ["Урик (Замостье)", "Тургская", "Карлук", "Столбова"],
  },
  {
    id: 5, min: 2300, fee: 600, color: "from-rose-500 to-rose-600", ring: "ring-rose-400",
    zones: ["Ширяева", "Галки", "Зыкова", "Оёк", "Бутырки", "Коты", "Усть-Куда", "Московщина", "Лыловщина", "Тайтура", "Горяшина"],
  },
  {
    id: 6, min: 3300, fee: 1000, color: "from-fuchsia-500 to-fuchsia-600", ring: "ring-fuchsia-400",
    zones: ["Мишонкова", "Егоровщина", "Сосновый Бор", "Жердовка", "Черемушки", "Максимовщина", "Ревякина", "Каштак", "Бургаз"],
  },
];

// Проверяем, что все 34 зоны в массиве deliveryZones действительно покрыты группами
const covered = new Set(GROUPS.flatMap((g) => g.zones));
const uncovered = deliveryZones.filter((z) => !covered.has(z.name));
if (uncovered.length > 0) console.warn("⚠ Зоны не в группах:", uncovered.map((z) => z.name));

export default function ZonesModal({ onClose }) {
  return (
    <Modal title="Зоны доставки (34 зоны, 6 групп)" onClose={onClose}>
      <p className="text-sm text-stone-300 mb-4">
        Чем дальше зона от кафе (с. Хомутово, ул. Мичурина, 1Б), тем выше минимальная сумма заказа и стоимость платной доставки.
      </p>

      <div className="space-y-4">
        {GROUPS.map((g) => (
          <div key={g.id} className="bg-brand-dark rounded-xl overflow-hidden border border-stone-700">
            {/* Заголовок группы с градиентом */}
            <div className={`bg-gradient-to-r ${g.color} px-4 py-3 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-black/30 text-white font-bold flex items-center justify-center text-sm">
                  {g.id}
                </span>
                <div>
                  <p className="text-white font-bold text-sm">Группа {g.id}</p>
                  <p className="text-white/80 text-xs">удалённость растёт →</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="bg-white/95 text-stone-900 text-xs font-bold px-2.5 py-1 rounded-full">
                  от {g.min} ₽
                </span>
                <span className="bg-black/40 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  платно {g.fee} ₽
                </span>
              </div>
            </div>

            {/* Список зон внутри группы */}
            <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {g.zones.map((z) => (
                <div key={z} className={`px-3 py-1.5 rounded-md bg-brand-card text-sm text-stone-200 border-l-4 border-l-${g.ring.replace("ring-", "")} ${g.ring.replace("ring-", "border-l-")}`}>
                  {z}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 p-3 rounded-lg bg-stone-800/60 text-xs text-stone-300">
        <p className="font-bold text-brand-yellow mb-1">📌 Правило расчёта</p>
        <p>При заказе свыше минимальной суммы группы — доставка <b className="text-white">бесплатно</b>.</p>
        <p>Ни порога — доставка платная по тарифу группы.</p>
      </div>
    </Modal>
  );
}