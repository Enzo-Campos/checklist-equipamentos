import './Modal.css';

export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel tag-card rise" onClick={(e) => e.stopPropagation()}>
        <div className="spread" style={{ marginBottom: 16 }}>
          <h3>{title}</h3>
          <button className="btn btn-icon btn-ghost" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
