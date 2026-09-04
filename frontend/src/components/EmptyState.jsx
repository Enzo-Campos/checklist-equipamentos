export default function EmptyState({ title, hint }) {
  return (
    <div className="empty-state">
      <h3 style={{ color: 'var(--text-secondary)', marginBottom: 6 }}>{title}</h3>
      {hint && <p>{hint}</p>}
    </div>
  );
}
