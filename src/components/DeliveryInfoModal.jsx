// DeliveryInfoModal.jsx
import Modal from "./Modal";
export default function DeliveryInfoModal({ onClose, onZones }) {
  return (
    <Modal title="Информация о доставке" onClose={onClose}>
      <p className="text-sm mb-2">Кафе-доставка «МестоВстречи» — европейская и японская кухня.</p>
      <p className="text-sm mb-2">📍 с. Хомутово, ул. Мичурина, 1Б</p>
      <p className="text-sm mb-2">📞 +7 904 143 02 02</p>
      <p className="text-sm mb-4">🕙 ежедневно 10:00–22:55 (Asia/Irkutsk)</p>
      <div className="flex gap-3">
        <button onClick={onZones} className="px-4 py-2 rounded-full bg-brand-yellow text-black font-semibold hover:opacity-90">Зоны доставки</button>
        <button onClick={onClose} className="px-4 py-2 rounded-full border border-stone-600 hover:border-brand-yellow">Закрыть</button>
      </div>
    </Modal>
  );
}