export default function Loader({ label = 'Carregando...' }) {
  return (
    <div className="row" style={{ padding: '32px 0', justifyContent: 'center' }}>
      <span className="spinner" />
      <span className="eyebrow">{label}</span>
    </div>
  );
}
