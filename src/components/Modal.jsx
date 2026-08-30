// Modal.jsx
export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="modal bg-brand-card rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-brand-yellow">{title}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-white">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}