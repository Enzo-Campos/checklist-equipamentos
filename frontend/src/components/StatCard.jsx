import './StatCard.css';

export default function StatCard({ label, value, hint, icon: Icon, accent }) {
  return (
    <div className={`stat-card ${accent ? 'accent' : ''}`}>
      <div className="stat-card-top">
        <span className="eyebrow" style={accent ? { color: 'rgba(255,255,255,0.75)' } : undefined}>
          {label}
        </span>
        {Icon && (
          <span className="stat-card-icon">
            <Icon size={16} />
          </span>
        )}
      </div>
      <span className="stat-card-value">{value}</span>
      {hint && <span className="stat-card-hint">{hint}</span>}
    </div>
  );
}
