import { calcDelivery, deliveryZones } from "../data/zones";
import { applyPromo } from "../data/promo";

// ── Тарифная сетка (отчёт 6.4, таблица 2) ──
test("бесплатная доставка при заказе выше порога", () =>
  expect(calcDelivery({ minOrder: 600, paidFee: 200 }, 700)).toBe(0));

test("платная доставка ниже порога", () =>
  expect(calcDelivery({ minOrder: 600, paidFee: 200 }, 500)).toBe(200));

test("порог группы 6 (3300) на границе — бесплатно", () =>
  expect(calcDelivery({ minOrder: 3300, paidFee: 1000 }, 3300)).toBe(0));

test("в справочнике ровно 34 зоны доставки", () =>
  expect(deliveryZones.length).toBe(34));

test("зоны образуют ровно 6 тарифных групп", () => {
  const tariffs = new Set(deliveryZones.map((z) => `${z.minOrder}-${z.paidFee}`));
  expect(tariffs.size).toBe(6);
});

// ── Промокоды (корзина) ──
test("промокод MV10 даёт скидку 10%", () =>
  expect(applyPromo("MV10", 1000)).toBe(100));

test("промокод MV200 даёт скидку 200 ₽", () =>
  expect(applyPromo("MV200", 1000)).toBe(200));

test("неизвестный промокод отклоняется", () =>
  expect(applyPromo("XXX", 1000)).toBeNull());