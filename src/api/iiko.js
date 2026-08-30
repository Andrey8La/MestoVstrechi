// Точка интеграции с iiko (перспектива, разд. 6.2 отчёта).
// В боевой версии здесь будет: POST https://<iiko-server>/api/orders (REST API, JSON).
export function sendOrderToIiko(order) {
  console.log("[iiko] order payload:", JSON.stringify(order));
}