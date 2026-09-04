const LABELS = {
  aberta: 'Aberta',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

export default function StatusStamp({ status }) {
  return <span className={`stamp stamp-${status}`}>{LABELS[status] || status}</span>;
}
