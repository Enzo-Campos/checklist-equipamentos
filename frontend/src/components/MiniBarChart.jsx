import './MiniBarChart.css';

export default function MiniBarChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="mini-bar-chart">
      {data.map((d) => (
        <div key={d.label} className="mini-bar-col" title={`${d.label}: ${d.value}`}>
          <span className="mini-bar-value">{d.value > 0 ? d.value : ''}</span>
          <div className="mini-bar-track">
            <div className="mini-bar-fill" style={{ height: `${Math.max(4, (d.value / max) * 100)}%` }} />
          </div>
          <span className="mini-bar-label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
