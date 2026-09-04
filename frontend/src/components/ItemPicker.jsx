import { imageUrl } from '../api/client';
import './ItemPicker.css';

export default function ItemPicker({ itens, selecionados, onToggle }) {
  if (itens.length === 0) {
    return <p className="eyebrow">Nenhum item disponível no momento.</p>;
  }

  return (
    <div className="item-picker">
      {itens.map((item) => {
        const ativo = selecionados.includes(item.id);
        return (
          <button
            type="button"
            key={item.id}
            className={`item-tile ${ativo ? 'active' : ''}`}
            onClick={() => onToggle(item.id)}
          >
            <span className="item-tile-check">{ativo ? '✓' : ''}</span>
            <div className="item-tile-thumb">
              {item.image ? (
                <img src={imageUrl(item.image)} alt="" />
              ) : (
                <span className="mono">{item.nome.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <span className="item-tile-nome">{item.nome}</span>
          </button>
        );
      })}
    </div>
  );
}
