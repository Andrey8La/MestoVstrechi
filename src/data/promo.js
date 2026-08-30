export const promoCodes = { MV10: { type: "percent", value: 10 }, MV200: { type: "fixed", value: 200 } };
export const applyPromo = (code, sum) => {
  const p = promoCodes[String(code).toUpperCase().trim()];
  if (!p) return null;
  return p.type === "percent" ? Math.round((sum * p.value) / 100) : p.value;
};