import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { deliveryZones, calcDelivery } from "../data/zones";
import DeliveryInfoModal from "../components/DeliveryInfoModal";
import ZonesModal from "../components/ZonesModal";
import UpsellCarousel from "../components/UpsellCarousel";
import { sendOrderToIiko } from "../api/iiko";

export default function CheckoutPage() {
  const { items, change, total, clear } = useContext(CartContext);
  const [f, setF] = useState({
    type: "Доставка", name: "", phone: "", address: "", flat: "",
    domofon: "", entrance: "", floor: "", comment: "",
    time: "asap", day: "Сегодня", clock: "12:45",
    payment: "Наличными при получении", zone: "", agree: false,
  });
  const [err, setErr] = useState({});
  const [infoOpen, setInfoOpen] = useState(false);
  const [zonesOpen, setZonesOpen] = useState(false);
  const [done, setDone] = useState(null);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const zone = deliveryZones.find((z) => z.name === f.zone);
  const delivery = f.type === "Доставка" && zone ? calcDelivery(zone, total) : 0;
  const short = f.type === "Доставка" && zone ? total < zone.minOrder : false;

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = "Введите имя";
    if (!f.phone.trim()) er.phone = "Введите номер телефона";
    if (f.type === "Доставка" && !f.address.trim()) er.address = "Введите адрес доставки";
    if (f.type === "Доставка" && !f.flat.trim()) er.flat = "Введите кв/офис";
    setErr(er);
    if (Object.keys(er).length || short) return;   // ⚠ зона с недобором минимума тоже блокирует
    const order = {
      id: Date.now(), ...f, items,
      sum: total + delivery, delivery, status: "новый",
      when: f.time === "asap" ? "ближайшее время" : `${f.day}, ${f.clock}`,
    };
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.unshift(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    sendOrderToIiko(order);
    setDone(order);
    clear();
    window.scrollTo(0, 0);
  };

  /* ── Экран «Заказ принят» + трекинг статуса (табл. 1) ── */
  if (done) return (
    <main className="p-8 max-w-xl mx-auto text-center">
      <div className="text-5xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold text-brand-yellow">Заказ №{String(done.id).slice(-4)} принят!</h1>
      <p className="mt-3 text-stone-300">Сумма: <b>{done.sum} ₽</b> · {done.payment}</p>
      <p className="mt-1 text-stone-300">Время: {done.when}</p>
      <div className="mt-6 bg-brand-card rounded-xl p-4">
        <p className="text-sm text-stone-400 mb-1">Статус заказа</p>
        <p className="text-lg font-bold text-brand-yellow">{done.status}</p>
        <p className="text-xs text-stone-500 mt-1">далее: готовится → в доставке → выполнен</p>
      </div>
      <a href="/" className="inline-block mt-6 text-brand-yellow underline">← Вернуться в меню</a>
    </main>
  );

  if (items.length === 0) return (
    <main className="p-8 text-center text-stone-400">
      Корзина пуста. <a href="/" className="text-brand-yellow underline">Перейти в меню</a>
    </main>
  );

  return (
    <main className="p-4 grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* ══ ЛЕВАЯ КОЛОНКА — форма ══ */}
      <form onSubmit={submit} noValidate>
        <a href="/" className="text-stone-400 text-sm hover:text-brand-yellow">← К меню</a>
        <h1 className="text-xl font-bold my-4">Оформление заказа</h1>

        <select value={f.type} onChange={(e) => set("type", e.target.value)}
          className="w-full bg-transparent border-b border-stone-600 focus:border-brand-yellow outline-none py-2 mb-4">
          <option className="bg-brand-card">Доставка</option>
          <option className="bg-brand-card">Самовывоз</option>
        </select>

        <Field label="Имя" v={f.name} onChange={(v) => set("name", v)} err={err.name} />
        <Field label="Телефон" v={f.phone} onChange={(v) => set("phone", v)} err={err.phone} />

        {f.type === "Доставка" && (
          <>
            <Field label="Адрес доставки" v={f.address} onChange={(v) => set("address", v)} err={err.address}
              icon="🗺" onIcon={() => setZonesOpen(true)} />
            <div className="grid grid-cols-4 gap-3">
              <Field label="Кв/офис" v={f.flat} onChange={(v) => set("flat", v)} err={err.flat} />
              <Field label="Домофон" v={f.domofon} onChange={(v) => set("domofon", v)} />
              <Field label="Подъезд" v={f.entrance} onChange={(v) => set("entrance", v)} />
              <Field label="Этаж" v={f.floor} onChange={(v) => set("floor", v)} />
            </div>

            <label className="block text-sm text-stone-400 mt-4 mb-1">Зона доставки</label>
            <select value={f.zone} onChange={(e) => set("zone", e.target.value)}
              className="w-full bg-transparent border-b border-stone-600 focus:border-brand-yellow outline-none py-2">
              <option value="" className="bg-brand-card">— выбери зону —</option>
              {deliveryZones.map((z) => <option key={z.name} className="bg-brand-card">{z.name}</option>)}
            </select>
            {zone && (
              <p className="text-xs mt-2 text-stone-400">
                Мин. заказ: <b>{zone.minOrder} ₽</b> · Доставка: <b>{delivery === 0 ? "бесплатно" : delivery + " ₽"}</b>
              </p>
            )}
            {short && (
              <p className="text-red-500 text-xs mt-1">⚠ До минимальной суммы заказа не хватает {zone.minOrder - total} ₽</p>
            )}
          </>
        )}

        <Field label="Комментарий" v={f.comment} onChange={(v) => set("comment", v)}
          hint="Укажите дополнительную информацию или пожелания к заказу." />

        <select value={f.time} onChange={(e) => set("time", e.target.value)}
          className="w-full bg-transparent border-b border-stone-600 focus:border-brand-yellow outline-none py-2 mt-2">
          <option value="asap" className="bg-brand-card">🕐 Заказ на ближайшее время</option>
          <option value="exact" className="bg-brand-card">🕐 Заказ на определённое время</option>
        </select>
        {f.time === "exact" && (
          <div className="flex gap-2 mt-3 items-center">
            {["Сегодня", "Завтра"].map((d) => (
              <button key={d} type="button" onClick={() => set("day", d)}
                className={`px-4 py-2 rounded-full text-sm transition ${f.day === d ? "bg-white text-black font-semibold" : "border border-stone-600 hover:border-brand-yellow"}`}>
                {d}
              </button>
            ))}
            <input type="time" value={f.clock} onChange={(e) => set("clock", e.target.value)} className="bg-brand-card p-2 rounded" />
          </div>
        )}

        <select value={f.payment} onChange={(e) => set("payment", e.target.value)}
          className="w-full bg-transparent border-b border-stone-600 focus:border-brand-yellow outline-none py-2 mt-4">
          <option className="bg-brand-card">💵 Наличными при получении</option>
          <option className="bg-brand-card">💳 Картой при получении</option>
        </select>

        {/* Баннер с hover-ссылкой (п. 5) */}
        <div className="bg-stone-800/70 rounded p-3 text-sm text-center mt-5">
          Ознакомьтесь с{" "}
          <a href="#" className="info-link" onClick={(e) => { e.preventDefault(); setInfoOpen(true); }}>информацией о доставке</a>{" "}
          перед созданием заказа
        </div>

        {/* Согласие ПДн (п. 8) */}
        <label className="flex gap-2 items-start text-sm mt-4 cursor-pointer">
          <input type="checkbox" checked={f.agree} onChange={(e) => set("agree", e.target.checked)} className="mt-0.5" />
          <span>
            Я ознакомлен(-а) с{" "}
            <a href="/privacy" target="_blank" className="info-link">Политикой обработки персональных данных ИП Макаровой Е.А.</a>{" "}
            и даю согласие на обработку персональных данных.
          </span>
        </label>

        <button disabled={!f.agree}
          className="mt-5 px-12 py-3 rounded bg-stone-900 border border-brand-yellow text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-yellow hover:text-black transition">
          Заказать
        </button>
      </form>

      {/* ══ ПРАВАЯ КОЛОНКА — «Ваш заказ» ══ */}
      <aside>
        <h2 className="text-xl font-bold mb-4">Ваш заказ</h2>
        {items.map((i) => (
          <div key={i.id} className="flex items-center gap-3 mb-3">
            <img src={i.img} onError={(e) => (e.currentTarget.src = "/img/placeholder.svg")} className="w-14 h-14 rounded object-cover" alt="" />
            <div className="flex-1 text-sm">{i.name}</div>
            <button onClick={() => change(i.id, -1)} className="border border-stone-600 rounded px-1.5 hover:border-brand-yellow">−</button>
            <span>{i.qty}</span>
            <button onClick={() => change(i.id, 1)} className="border border-stone-600 rounded px-1.5 hover:border-brand-yellow">+</button>
            <div className="w-20 text-right text-sm">{i.qty * i.price} ₽</div>
          </div>
        ))}
        <p className="text-sm mt-4 text-stone-400">Стоимость заказа: {total} ₽</p>
        {f.type === "Доставка" && zone && (
          <p className="text-sm text-stone-400">Доставка: {delivery === 0 ? "бесплатно" : delivery + " ₽"}</p>
        )}
        <p className="font-bold mt-2 text-lg">К оплате: {total + delivery} ₽</p>
        <UpsellCarousel />
      </aside>

      {infoOpen && <DeliveryInfoModal onClose={() => setInfoOpen(false)} onZones={() => { setInfoOpen(false); setZonesOpen(true); }} />}
      {zonesOpen && <ZonesModal onClose={() => setZonesOpen(false)} />}
    </main>
  );
}

/* Поле в стиле Restik: линия, placeholder-подпись, красная подсветка при ошибке */
function Field({ label, v, onChange, err, hint, icon, onIcon }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <input value={v} onChange={(e) => onChange(e.target.value)} placeholder={label}
          className={`flex-1 bg-transparent border-b ${err ? "border-red-500 placeholder-red-400" : "border-stone-600 placeholder-stone-500"} focus:border-brand-yellow outline-none py-2`} />
        {icon && <button type="button" onClick={onIcon} title="Зоны доставки" className="text-stone-400 hover:text-brand-yellow">{icon}</button>}
      </div>
      {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
      {hint && !err && <p className="text-stone-500 text-xs mt-1">{hint}</p>}
    </div>
  );
}