import { useMemo, useState } from 'react';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { classifyGlucose } from '../utils/health.js';

export default function History({ state, updateState }) {
  const [filter, setFilter] = useState('todos');
  const { patient } = state;

  const rows = useMemo(() => {
    const glucose = state.glucoseLogs.map((log) => ({ type: 'glucosa', date: log.measuredAt, title: `${log.value} mg/dL`, detail: `${log.context}${log.symptoms ? ` · ${log.symptoms}` : ''}`, raw: log }));
    const insulin = state.insulinLogs.map((log) => ({ type: 'insulina', date: log.appliedAt, title: `${log.doseUnits} U · ${log.insulinName}`, detail: `${log.insulinType} · ${log.injectionSite}`, raw: log }));
    const medication = state.medicationLogs.map((log) => ({ type: 'medicamento', date: log.takenAt, title: log.medicationName, detail: `${log.dose || 'Sin dosis'} · ${log.notes || ''}`, raw: log }));
    const meal = state.mealLogs.map((log) => ({ type: 'comida', date: log.eatenAt, title: log.mealType, detail: `${log.description}${log.estimatedCarbs ? ` · ${log.estimatedCarbs} g carb.` : ''}`, raw: log }));
    return [...glucose, ...insulin, ...medication, ...meal].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [state]);

  const filtered = rows.filter((row) => filter === 'todos' || row.type === filter);

  function deleteItem(row) {
    const map = {
      glucosa: 'glucoseLogs',
      insulina: 'insulinLogs',
      medicamento: 'medicationLogs',
      comida: 'mealLogs'
    };
    const key = map[row.type];
    updateState((prev) => ({ ...prev, [key]: prev[key].filter((item) => item.id !== row.raw.id) }));
  }

  return (
    <div className="page-grid">
      <Card className="hero-card compact-hero">
        <p className="eyebrow">Línea de tiempo</p>
        <h1>Historial</h1>
        <p>Todo lo registrado en orden cronológico. Por fin un lugar donde los datos sí aparecen cuando uno los necesita, milagro administrativo.</p>
      </Card>

      <Card>
        <div className="filter-row">
          {['todos', 'glucosa', 'insulina', 'medicamento', 'comida'].map((item) => (
            <button key={item} className={`chip ${filter === item ? 'active' : ''}`} onClick={() => setFilter(item)} type="button">{item}</button>
          ))}
        </div>
      </Card>

      <Card title="Registros">
        {filtered.length ? (
          <div className="timeline">
            {filtered.map((row) => {
              const status = row.type === 'glucosa' ? classifyGlucose(row.raw.value, patient) : null;
              return (
                <article className="timeline-item" key={`${row.type}-${row.raw.id}`}>
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-title">
                      <div>
                        <Badge tone={row.type === 'glucosa' ? 'info' : row.type === 'insulina' ? 'purple' : 'muted'}>{row.type}</Badge>
                        <h3>{row.title}</h3>
                      </div>
                      <button className="ghost-button danger-text" onClick={() => deleteItem(row)} type="button">Eliminar</button>
                    </div>
                    <p>{row.detail}</p>
                    {row.raw.notes && <small>{row.raw.notes}</small>}
                    <span>{new Date(row.date).toLocaleString('es-CO')}</span>
                    {status && <Badge tone={status.tone}>{status.label}</Badge>}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState />
        )}
      </Card>
    </div>
  );
}
