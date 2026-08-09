export default function EmptyState({ title = 'Sin registros', text = 'Cuando agregues información aparecerá aquí.' }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">♡</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
