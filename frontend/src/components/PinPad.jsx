import { useState } from 'react';
import './PinPad.css';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];

export default function PinPad({ nomeFuncionario, onConfirm, onCancel, loading, error }) {
  const [pin, setPin] = useState('');

  const press = (key) => {
    if (loading) return;
    if (key === 'back') {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (key === '') return;
    setPin((p) => (p.length < 4 ? p + key : p));
  };

  const confirmar = () => {
    if (pin.length === 4) onConfirm(pin);
  };

  return (
    <div className="pinpad stack">
      <p className="eyebrow">Confirmar como {nomeFuncionario}</p>

      <div className="pinpad-dots">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`pinpad-dot ${i < pin.length ? 'filled' : ''}`} />
        ))}
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="pinpad-grid">
        {KEYS.map((key, i) =>
          key === '' ? (
            <span key={i} />
          ) : (
            <button
              key={i}
              type="button"
              className="pinpad-key"
              onClick={() => press(key)}
              disabled={loading}
            >
              {key === 'back' ? '⌫' : key}
            </button>
          )
        )}
      </div>

      <div className="row" style={{ justifyContent: 'stretch' }}>
        <button className="btn btn-ghost btn-block" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button
          className="btn btn-primary btn-block"
          onClick={confirmar}
          disabled={pin.length !== 4 || loading}
        >
          {loading ? 'Confirmando...' : 'Confirmar'}
        </button>
      </div>
    </div>
  );
}
