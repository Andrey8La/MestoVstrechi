// Часы работы: ежедневно 10:00–22:55 (Asia/Irkutsk)
export function isOpenNow() {
  const t = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Irkutsk" }));
  const m = t.getHours() * 60 + t.getMinutes();
  return m >= 600 && m <= 1375;
}

// Override администратора (снять ограничение)
export const getForceOpen = () => localStorage.getItem("forceOpen") === "1";
export const setForceOpen = (v) => localStorage.setItem("forceOpen", v ? "1" : "0");

// Можно ли оформить заказ сейчас
export const canOrder = () => isOpenNow() || getForceOpen();