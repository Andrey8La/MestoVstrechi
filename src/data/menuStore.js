import { menu } from "./menu";

export const getOverrides = () => JSON.parse(localStorage.getItem("menuOverrides") || "{}");
export const saveOverrides = (o) => localStorage.setItem("menuOverrides", JSON.stringify(o));
export const getExtraMenu = () => JSON.parse(localStorage.getItem("extraMenu") || "[]");
export const saveExtraMenu = (e) => localStorage.setItem("extraMenu", JSON.stringify(e));

// Меню для клиента: база + добавленные в админке + правки цены/скрытия
export function buildMenu() {
  const ov = getOverrides();
  return [...menu, ...getExtraMenu()]
    .map((d) => (ov[d.id] ? { ...d, ...ov[d.id] } : d))
    .filter((d) => !d.hidden);
}