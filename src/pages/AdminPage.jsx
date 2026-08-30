import { useState, useEffect } from "react";
import { categories, menu } from "../data/menu";
import { getOverrides, saveOverrides, getExtraMenu, saveExtraMenu } from "../data/menuStore";

const PASS = "mv2026";
const NEXT = { "новый": "готовится", "готовится": "в доставке", "в доставке": "выполнен" };

export default function AdminPage() {
  const [ok, setOk] = useState(sessionStorage.getItem("admin") === "1");
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [extra, setExtra] = useState([]);
  const [ov, setOv] = useState({});
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

  /* ── Форма входа (рисунок Д.1) ── */
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
  const allDishes = [...menu, ...extra].map((d) => (ov[d.id] ? { ...d, ...ov[d.id] } : d));

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <div className="flex gap-4 mb-5 items-center flex-wrap">
        <h1 className="text-xl font-bold text-brand-yellow">Админ-панель</h1>
        <button onClick={() => setTab("orders")} className={tab === "orders" ? "text-brand-yellow font-bold" : "text-stone-400"}>Заказы ({active.length})</button>
        <button onClick={() => setTab("archive")} className={tab === "archive" ? "text-brand-yellow font-bold" : "text-stone-400"}>Архив</button>
        <button onClick={() => setTab("menu")} className={tab === "menu" ? "text-brand-yellow font-bold" : "text-stone-400"}>Меню</button>
        <button onClick={() => { sessionStorage.removeItem("admin"); setOk(false); }} className="ml-auto text-stone-400 hover:text-red-400">Выйти</button>
      </div>

      {/* ── Заказы / Архив (рисунки Д.2–Д.5) ── */}
      {(tab === "orders" || tab === "archive") && (
        (tab === "orders" ? active : archive).length === 0 ? <p className="text-stone-500">Пока пусто.</p> :
        (tab === "orders" ? active : archive).map((o) => (
          <div key={o.id} className="bg-brand-card rounded-xl p-4 mb-3">
            <div className="flex justify-between items-center">
              <p className="font-bold">№{String(o.id).slice(-4)} · {o.when} · <span className="text-brand-yellow">{o.sum} ₽</span></p>
              <span className="text-xs px-2 py-1 rounded-full bg-stone-800 text-brand-yellow">{o.status}</span>
            </div>
            <p className="text-sm text-stone-400 mt-1">{o.name}, {o.phone}</p>
            {o.type === "Доставка" && (
              <p className="text-sm text-stone-400">Адрес: {o.address}, кв/офис {o.flat} · зона: {o.zone} · доставка: {o.delivery === 0 ? "бесплатно" : o.delivery + " ₽"}</p>
            )}
            <p className="text-sm mt-2">{o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}</p>
            <p className="text-xs text-stone-500 mt-1">Оплата: {o.payment}{o.comment ? ` · Комментарий: ${o.comment}` : ""}</p>
            {o.status !== "выполнен" && (
              <button onClick={() => saveOrders(orders.map((x) => x.id === o.id ? { ...x, status: NEXT[x.status] } : x))}
                className="mt-3 px-4 py-1.5 rounded-full border border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black transition">
                Статус: {o.status} →
              </button>
            )}
          </div>
        ))
      )}

      {/* ── Меню: добавить блюдо (Д.6) + изменение цены/скрытие (Д.7–Д.8) ── */}
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
            <h2 className="font-bold mb-3">Изменить цену / скрыть блюдо</h2>
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {allDishes.map((d) => (
                <div key={d.id} className={`flex items-center gap-2 mb-2 text-sm ${d.hidden ? "opacity-40" : ""}`}>
                  <span className="flex-1">{d.name} · <b>{d.price} ₽</b></span>
                  {editId === d.id ? (
                    <>
                      <input value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-20 bg-brand-card p-1 rounded" />
                      <button onClick={() => { const o2 = { ...ov, [d.id]: { ...ov[d.id], price: +editPrice } }; saveOverrides(o2); setOv(o2); setEditId(null); }} className="text-brand-yellow font-bold">OK</button>
                    </>
                  ) : (
                    <button onClick={() => { setEditId(d.id); setEditPrice(String(d.price)); }} className="text-stone-400 hover:text-brand-yellow">Изменить</button>
                  )}
                  <button onClick={() => { const o2 = { ...ov, [d.id]: { ...ov[d.id], hidden: !d.hidden } }; saveOverrides(o2); setOv(o2); }} className="text-stone-400 hover:text-red-400">{d.hidden ? "Показать" : "Скрыть"}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}