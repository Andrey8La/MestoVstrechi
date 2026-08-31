import { useState, useEffect, useMemo } from "react";
import { categories, menu } from "../data/menu";
import { getOverrides, saveOverrides, getExtraMenu, saveExtraMenu } from "../data/menuStore";
import { getForceOpen, setForceOpen } from "../data/shopStatus";

const PASS = "mv2026";

// ✅ Цепочки статусов по типу заказа
const nextStatus = (o) => {
  const chain = o.type === "Самовывоз"
    ? ["новый", "готовится", "готов к выдаче", "выполнен"]
    : ["новый", "готовится", "в доставке", "выполнен"];
  const i = chain.indexOf(o.status);
  return i >= 0 && i < chain.length - 1 ? chain[i + 1] : o.status;
};

const STATUS_STYLE = {
  "новый": "bg-yellow-500/15 text-yellow-400 border-yellow-500/40",
  "готовится": "bg-orange-500/15 text-orange-400 border-orange-500/40",
  "в доставке": "bg-sky-500/15 text-sky-400 border-sky-500/40",
  "готов к выдаче": "bg-violet-500/15 text-violet-400 border-violet-500/40",
  "выполнен": "bg-green-500/15 text-green-400 border-green-500/40",
};

const dayKey = (id) => new Date(id).toLocaleDateString("ru-RU");

export default function AdminPage() {
  const [ok, setOk] = useState(sessionStorage.getItem("admin") === "1");
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [extra, setExtra] = useState([]);
  const [ov, setOv] = useState({});
  const [force, setForce] = useState(getForceOpen());
  const [dish, setDish] = useState({ cat: categories[0], name: "", desc: "", weight: "", price: "", img: "" });
  const [editId, setEditId] = useState(null);
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    if (ok) {
      setOrders(JSON.parse(localStorage.getItem("orders") || "[]"));
      setExtra(getExtraMenu());
      setOv(getOverrides());
    }
  }, [ok, tab]);

  const saveOrders = (o) => { localStorage.setItem("orders", JSON.stringify(o)); setOrders(o); };
  const deleteOrder = (id) => { if (window.confirm("Удалить заказ безвозвратно?")) saveOrders(orders.filter((x) => x.id !== id)); };
  const deleteDish = (id) => {
    if (!window.confirm("Удалить добавленное блюдо?")) return;
    const e2 = extra.filter((x) => x.id !== id);
    saveExtraMenu(e2); setExtra(e2);
  };

  /* ── Выручка по дням: наличные / карта / всего ── */
  const stats = useMemo(() => {
    const byDay = {};
    orders.forEach((o) => {
      const k = dayKey(o.id);
      if (!byDay[k]) byDay[k] = { day: k, first: o.id, count: 0, cash: 0, card: 0, total: 0 };
      const s = byDay[k];
      s.count += 1;
      s.total += o.sum;
      if ((o.payment || "").includes("Наличными")) s.cash += o.sum; else s.card += o.sum;
    });
    return Object.values(byDay).sort((a, b) => b.first - a.first);
  }, [orders]);

  const today = stats.find((s) => s.day === new Date().toLocaleDateString("ru-RU")) || { count: 0, cash: 0, card: 0, total: 0 };

  if (!ok) return (
    <main className="p-8 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4 text-brand-yellow">Вход в админ-режим</h1>
      <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Пароль"
        className="w-full bg-brand-card p-3 rounded border border-stone-700 focus:border-brand-yellow outline-none" />
      <button onClick={() => { if (pass === PASS) { sessionStorage.setItem("admin", "1"); setOk(true); } else alert("Неверный пароль"); }}
        className="mt-3 w-full bg-brand-yellow text-black font-bold py-3 rounded hover:opacity-90 transition">Войти</button>
      <p className="text-xs text-stone-500 mt-2">Демо-пароль: mv2026</p>
    </main>
  );

  const active = orders.filter((o) => o.status !== "выполнен");
  const archive = orders.filter((o) => o.status === "выполнен");
  const allDishes = [
    ...menu.map((d) => ({ ...d, extra: false })),
    ...extra.map((d) => ({ ...d, extra: true })),
  ].map((d) => (ov[d.id] ? { ...d, ...ov[d.id] } : d));

  const OrderCard = ({ o }) => (
    <div className="bg-brand-card rounded-xl p-4 mb-3 border border-stone-800 hover:border-stone-600 transition">
      <div className="flex justify-between items-start gap-2 flex-wrap">
        <div>
          <p className="font-bold">№{String(o.id).slice(-4)} · {new Date(o.id).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })} · {o.when}</p>
          <p className="text-sm text-stone-400 mt-1">👤 {o.name}, {o.phone}</p>
          {o.type === "Доставка" && (
            <p className="text-sm text-stone-400">📍 {o.address}, кв/офис {o.flat} · зона: {o.zone}</p>
          )}
          {o.type === "Самовывоз" && <p className="text-sm text-stone-400">🏪 Самовывоз: с. Хомутово, ул. Мичурина, 1Б</p>}
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-brand-yellow">{o.sum} ₽</p>
          <span className={`inline-block text-xs px-2 py-1 rounded-full border mt-1 ${STATUS_STYLE[o.status]}`}>{o.status}</span>
        </div>
      </div>
      <div className="mt-3 bg-brand-dark/60 rounded-lg p-2.5 text-sm">
        {o.items.map((i) => (
          <div key={i.id} className="flex justify-between gap-2">
            <span>{i.name} ×{i.qty}</span>
            <span className="text-stone-400">{i.qty * i.price} ₽</span>
          </div>
        ))}
        {o.delivery > 0 && <div className="flex justify-between text-stone-400"><span>Доставка</span><span>{o.delivery} ₽</span></div>}
      </div>
      <p className="text-xs text-stone-500 mt-2">💳 {o.payment}{o.comment ? ` · 💬 ${o.comment}` : ""}</p>
      <div className="flex gap-2 mt-3">
        {o.status !== "выполнен" && (
          <button onClick={() => saveOrders(orders.map((x) => x.id === o.id ? { ...x, status: nextStatus(x) } : x))}
            className="px-4 py-1.5 rounded-full border border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black transition">
            Статус: {o.status} →
          </button>
        )}
        <button onClick={() => deleteOrder(o.id)}
          className="px-4 py-1.5 rounded-full border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition">
          Удалить
        </button>
      </div>
    </div>
  );

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <div className="flex gap-4 mb-4 items-center flex-wrap">
        <h1 className="text-xl font-bold text-brand-yellow">Админ-панель</h1>
        <button onClick={() => setTab("orders")} className={tab === "orders" ? "text-brand-yellow font-bold" : "text-stone-400"}>Заказы ({active.length})</button>
        <button onClick={() => setTab("archive")} className={tab === "archive" ? "text-brand-yellow font-bold" : "text-stone-400"}>Архив</button>
        <button onClick={() => setTab("menu")} className={tab === "menu" ? "text-brand-yellow font-bold" : "text-stone-400"}>Меню</button>
        <button onClick={() => { sessionStorage.removeItem("admin"); setOk(false); }} className="ml-auto text-stone-400 hover:text-red-400">Выйти</button>
      </div>

      <label className="flex items-center gap-2 mb-5 text-sm cursor-pointer select-none">
        <input type="checkbox" checked={force} onChange={(e) => { setForce(e.target.checked); setForceOpen(e.target.checked); }} className="w-4 h-4" />
        <span>Принимать заказы даже когда закрыто</span>
        {force && <span className="text-brand-yellow text-xs">(ограничение снято администратором)</span>}
      </label>

      {(tab === "orders" || tab === "archive") && (
        <>
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-brand-card rounded-xl p-4 border-l-4 border-brand-yellow">
              <p className="text-xs text-stone-400">Итого сегодня</p>
              <p className="text-2xl font-bold text-brand-yellow">{today.total} ₽</p>
              <p className="text-xs text-stone-500">заказов: {today.count}</p>
            </div>
            <div className="bg-brand-card rounded-xl p-4 border-l-4 border-green-500">
              <p className="text-xs text-stone-400">💵 Наличными</p>
              <p className="text-2xl font-bold text-green-400">{today.cash} ₽</p>
            </div>
            <div className="bg-brand-card rounded-xl p-4 border-l-4 border-sky-500">
              <p className="text-xs text-stone-400">💳 Картой</p>
              <p className="text-2xl font-bold text-sky-400">{today.card} ₽</p>
            </div>
          </div>

          {stats.length > 0 && (
            <div className="bg-brand-card rounded-xl p-4 mb-5 overflow-x-auto">
              <p className="font-bold mb-2 text-sm">📈 Выручка по дням</p>
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="text-stone-400 text-xs border-b border-stone-700">
                    <th className="text-left py-1.5">Дата</th>
                    <th className="text-left">Заказов</th>
                    <th className="text-right">Наличные</th>
                    <th className="text-right">Карта</th>
                    <th className="text-right">Итого</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((s) => (
                    <tr key={s.day} className="border-b border-stone-800/60">
                      <td className="py-1.5">{s.day}{s.day === new Date().toLocaleDateString("ru-RU") && <span className="text-brand-yellow text-xs"> · сегодня</span>}</td>
                      <td>{s.count}</td>
                      <td className="text-right text-green-400">{s.cash} ₽</td>
                      <td className="text-right text-sky-400">{s.card} ₽</td>
                      <td className="text-right font-bold text-brand-yellow">{s.total} ₽</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(tab === "orders" ? active : archive).length === 0 ? <p className="text-stone-500">Пока пусто.</p> :
            (tab === "orders" ? active : archive).map((o) => <OrderCard key={o.id} o={o} />)}
        </>
      )}

      {tab === "menu" && (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-bold mb-3">Добавить блюдо</h2>
            <select value={dish.cat} onChange={(e) => setDish({ ...dish, cat: e.target.value })} className="w-full bg-brand-card p-2 rounded mb-2">{categories.map((c) => <option key={c}>{c}</option>)}</select>
            <input placeholder="Название" value={dish.name} onChange={(e) => setDish({ ...dish, name: e.target.value })} className="w-full bg-brand-card p-2 rounded mb-2" />
            <input placeholder="Описание" value={dish.desc} onChange={(e) => setDish({ ...dish, desc: e.target.value })} className="w-full bg-brand-card p-2 rounded mb-2" />
            <input placeholder="Вес (гр.)" value={dish.weight} onChange={(e) => setDish({ ...dish, weight: e.target.value })} className="w-full bg-brand-card p-2 rounded mb-2" />
            <input placeholder="Цена (₽)" value={dish.price} onChange={(e) => setDish({ ...dish, price: e.target.value })} className="w-full bg-brand-card p-2 rounded mb-2" />
            <input placeholder="Фото: имя файла (напр. 115.jpg → положи в public/img)" value={dish.img} onChange={(e) => setDish({ ...dish, img: e.target.value })} className="w-full bg-brand-card p-2 rounded mb-2" />
            <button onClick={() => {
              if (!dish.name || !dish.price) return alert("Название и цена обязательны");
              const e2 = [...extra, { ...dish, id: Date.now(), price: +dish.price, img: "/img/" + (dish.img || "placeholder.svg") }];
              saveExtraMenu(e2); setExtra(e2);
              setDish({ cat: categories[0], name: "", desc: "", weight: "", price: "", img: "" });
              alert("Блюдо добавлено на сайт");
            }} className="bg-brand-yellow text-black font-bold px-6 py-2 rounded hover:opacity-90 transition">Сохранить</button>
            <p className="text-xs text-stone-500 mt-2">Файл фото положи в public/img — блюдо сразу появится в меню клиента.</p>
          </div>
          <div>
            <h2 className="font-bold mb-3">Цена / скрыть / удалить</h2>
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {allDishes.map((d) => (
                <div key={d.id} className={`flex items-center gap-2 mb-2 text-sm ${d.hidden ? "opacity-40" : ""}`}>
                  <span className="flex-1">{d.name} · <b>{d.price} ₽</b>{d.extra && <span className="text-brand-yellow text-xs"> (добавлено)</span>}</span>
                  {editId === d.id ? (
                    <>
                      <input value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-20 bg-brand-card p-1 rounded" />
                      <button onClick={() => { const o2 = { ...ov, [d.id]: { ...ov[d.id], price: +editPrice } }; saveOverrides(o2); setOv(o2); setEditId(null); }} className="text-brand-yellow font-bold">OK</button>
                    </>
                  ) : (
                    <button onClick={() => { setEditId(d.id); setEditPrice(String(d.price)); }} className="text-stone-400 hover:text-brand-yellow">Изменить</button>
                  )}
                  <button onClick={() => { const o2 = { ...ov, [d.id]: { ...ov[d.id], hidden: !d.hidden } }; saveOverrides(o2); setOv(o2); }} className="text-stone-400 hover:text-red-400">{d.hidden ? "Показать" : "Скрыть"}</button>
                  {d.extra && <button onClick={() => deleteDish(d.id)} className="text-stone-400 hover:text-red-400">Удалить</button>}
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-500 mt-2">Базовые блюда скрываются, добавленные — удаляются полностью.</p>
          </div>
        </div>
      )}
    </main>
  );
}