// Точка интеграции с iiko (перспектива, разд. 6.2 отчёта).
export function sendOrderToIiko(order) {
  console.log("[iiko] order payload:", JSON.stringify(order));
}