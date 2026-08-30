export default function Footer() {
  return (
    <footer className="px-4 py-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <img src="/img/logo.png" onError={(e) => (e.currentTarget.src = "/img/logo.svg")} alt="" className="h-9 w-9 rounded-md" />
        <span className="text-sm text-stone-400">Кафе-доставка «МестоВстречи» — ОченьВкусно</span>
      </div>
      <a href="tel:+79041430202" className="text-brand-yellow font-semibold">+7 904 143 02 02</a>
    </footer>
  );
}