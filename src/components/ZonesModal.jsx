// ZonesModal.jsx
import Modal from "./Modal";
import { deliveryZones } from "../data/zones";
export default function ZonesModal({ onClose }) {
  return (
    <Modal title="Зоны доставки" onClose={onClose}>
      <table className="w-full text-sm">
        <thead><tr className="text-brand-yellow text-left"><th className="py-1">Зона</th><th>Мин. заказ</th><th>Платная доставка</th></tr></thead>
        <tbody>
          {deliveryZones.map((z) => (
            <tr key={z.name} className="border-t border-stone-700">
              <td className="py-1 pr-2">{z.name}</td><td className="pr-2">{z.minOrder} ₽</td><td>{z.paidFee} ₽</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-stone-400 mt-2">При заказе свыше минимальной суммы — доставка бесплатно.</p>
    </Modal>
  );
}