export default function EmptyState({ title, hint }) {
  return (
    <div className="empty-state">
      <h3 style={{ color: 'var(--paper-dim)', marginBottom: 6 }}>{title}</h3>
      {hint && <p>{hint}</p>}
    </div>
  );
}
