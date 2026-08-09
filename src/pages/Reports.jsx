import { useRef, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { averageGlucose, countOutOfRange } from '../utils/health.js';
import { downloadBackup, readBackup } from '../utils/storage.js';

export default function Reports({ state, updateState }) {
  const backupInput = useRef(null);
  const [backupMessage, setBackupMessage] = useState('');
  const { patient, glucoseLogs, insulinLogs, medicationLogs, mealLogs } = state;
  const avg = averageGlucose(glucoseLogs);
  const counts = countOutOfRange(glucoseLogs, patient);
  const total = counts.low + counts.inRange + counts.high;
  const chartData = [
    { name: 'Bajas', value: counts.low },
    { name: 'En rango', value: counts.inRange },
    { name: 'Altas', value: counts.high }
  ];

  function printReport() {
    window.print();
  }

  async function restoreBackup(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const ok = confirm('Al restaurar esta copia se reemplazará la información actual. ¿Deseas continuar?');
    if (!ok) return;

    try {
      updateState(await readBackup(file));
      setBackupMessage('Tus datos se restauraron correctamente.');
    } catch {
      setBackupMessage('No pudimos usar ese archivo. Elige una copia de seguridad creada por GlucoGuía.');
    }
  }

  return (
    <div className="page-grid report-page">
      <Card className="hero-card compact-hero no-print">
        <p className="eyebrow">Reporte</p>
        <h1>Resumen para consulta</h1>
        <p>Un reporte limpio para llevar a control. Nada de llegar con “creo que más o menos estuve bien”, ese gran método científico de la especie.</p>
        <div className="action-row">
          <button className="primary-button" onClick={printReport} type="button">Imprimir o guardar reporte</button>
          <button className="secondary-button" onClick={() => downloadBackup(state)} type="button">Descargar copia de seguridad</button>
          <button className="secondary-button" onClick={() => backupInput.current?.click()} type="button">Restaurar mis datos</button>
          <input
            ref={backupInput}
            className="visually-hidden"
            type="file"
            accept=".json,application/json"
            onChange={restoreBackup}
          />
        </div>
      </Card>

      {backupMessage && <div className="toast" role="status">{backupMessage}</div>}

      <Card title="Datos del paciente">
        <div className="profile-summary">
          <div><span>Nombre</span><strong>{patient.name}</strong></div>
          <div><span>Tipo de diabetes</span><strong>{patient.diabetesType}</strong></div>
          <div><span>Rango objetivo</span><strong>{patient.targetMin}–{patient.targetMax} mg/dL</strong></div>
          <div><span>Médico</span><strong>{patient.doctorName || 'No registrado'}</strong></div>
        </div>
      </Card>

      <div className="stats-grid">
        <Card><div className="stat-card"><span>Promedio glucosa</span><strong>{avg ? `${avg} mg/dL` : 'Sin dato'}</strong></div></Card>
        <Card><div className="stat-card"><span>Mediciones</span><strong>{glucoseLogs.length}</strong></div></Card>
        <Card><div className="stat-card"><span>Insulina</span><strong>{insulinLogs.length}</strong></div></Card>
        <Card><div className="stat-card"><span>Comidas</span><strong>{mealLogs.length}</strong></div></Card>
      </div>

      <Card title="Distribución de glucosa">
        {total ? (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : <EmptyState title="Sin datos de glucosa" />}
      </Card>

      <Card title="Resumen clínico de seguimiento" subtitle="Información registrada por el paciente. No constituye diagnóstico ni recomendación de dosis.">
        <div className="report-text">
          <p><Badge tone="info">Glucosa</Badge> Se registraron {glucoseLogs.length} mediciones. {counts.inRange} en rango, {counts.low} bajas y {counts.high} altas.</p>
          <p><Badge tone="purple">Insulina</Badge> Se registraron {insulinLogs.length} aplicaciones de insulina.</p>
          <p><Badge tone="muted">Medicamentos</Badge> Se registraron {medicationLogs.length} tomas de medicamentos.</p>
          <p><Badge tone="muted">Comidas</Badge> Se registraron {mealLogs.length} comidas o snacks.</p>
        </div>
      </Card>

      <Card title="Últimos registros de glucosa">
        {glucoseLogs.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Fecha</th><th>Valor</th><th>Contexto</th><th>Notas</th></tr></thead>
              <tbody>
                {glucoseLogs.slice(0, 12).map((log) => (
                  <tr key={log.id}>
                    <td>{new Date(log.measuredAt).toLocaleString('es-CO')}</td>
                    <td>{log.value} mg/dL</td>
                    <td>{log.context}</td>
                    <td>{log.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState />}
      </Card>
    </div>
  );
}
