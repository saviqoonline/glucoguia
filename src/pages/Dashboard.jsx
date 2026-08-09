import { AlertTriangle, CalendarClock, HeartPulse, Syringe } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { averageGlucose, classifyGlucose, countOutOfRange, getTodayLogs } from '../utils/health.js';

export default function Dashboard({ state, setActivePage }) {
  const { patient, glucoseLogs, insulinLogs, reminders } = state;
  const todayGlucose = getTodayLogs(glucoseLogs);
  const todayInsulin = getTodayLogs(insulinLogs, 'appliedAt');
  const latest = glucoseLogs[0];
  const avg = averageGlucose(glucoseLogs.slice(0, 14));
  const counts = countOutOfRange(glucoseLogs.slice(0, 30), patient);
  const classification = latest ? classifyGlucose(latest.value, patient) : null;

  const chartData = [...glucoseLogs]
    .slice(0, 14)
    .reverse()
    .map((log) => ({
      date: String(log.measuredAt || '').slice(5, 10),
      glucosa: Number(log.value)
    }));

  const nextReminder = reminders.filter((r) => r.active).sort((a, b) => a.time.localeCompare(b.time))[0];

  return (
    <div className="page-grid">
      <Card className="hero-card">
        <div className="hero-content">
          <div>
            <p className="eyebrow">Resumen de hoy</p>
            <h1>Hola, {patient.name || 'paciente'}<span className="desktop-greeting"> 👋🏼</span></h1>
            <p className="desktop-summary">
              Lleva tus registros, revisa tendencias y prepara reportes claros para consulta. La app acompaña, no receta dosis ni juega a ser endocrino con WiFi.
            </p>
            <p className="mobile-summary">Este es tu resumen de hoy. ¡Sigue así!</p>
          </div>
          <button className="primary-button" onClick={() => setActivePage('register')} type="button">
            Registrar ahora
          </button>
        </div>
      </Card>

      <div className="stats-grid">
        <Card>
          <div className="stat-card">
            <HeartPulse size={24} />
            <span>Última glucosa</span>
            <strong>{latest ? `${latest.value} mg/dL` : 'Sin dato'}</strong>
            {classification && <Badge tone={classification.tone}>{classification.label}</Badge>}
          </div>
        </Card>
        <Card>
          <div className="stat-card">
            <CalendarClock size={24} />
            <span>Promedio reciente</span>
            <strong>{avg ? `${avg} mg/dL` : 'Sin dato'}</strong>
            <small>Últimos 14 registros</small>
          </div>
        </Card>
        <Card>
          <div className="stat-card">
            <Syringe size={24} />
            <span>Insulina hoy</span>
            <strong>{todayInsulin.length}</strong>
            <small>Aplicaciones registradas</small>
          </div>
        </Card>
        <Card>
          <div className="stat-card">
            <AlertTriangle size={24} />
            <span>Fuera de rango</span>
            <strong>{counts.low + counts.high}</strong>
            <small>Últimos 30 registros</small>
          </div>
        </Card>
      </div>

      <Card title="Tendencia de glucosa" subtitle={`Rango objetivo: ${patient.targetMin}–${patient.targetMax} mg/dL`}>
        {chartData.length ? (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 20', 'dataMax + 20']} />
                <Tooltip />
                <ReferenceLine y={Number(patient.targetMin)} strokeDasharray="3 3" />
                <ReferenceLine y={Number(patient.targetMax)} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="glucosa" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState title="Aún no hay tendencia" text="Registra glucosa para ver la gráfica." />
        )}
      </Card>

      <div className="two-columns">
        <Card title="Registros de hoy">
          <div className="mini-list">
            <div><strong>{todayGlucose.length}</strong><span>Mediciones de glucosa</span></div>
            <div><strong>{todayInsulin.length}</strong><span>Aplicaciones de insulina</span></div>
          </div>
        </Card>
        <Card title="Próximo recordatorio">
          {nextReminder ? (
            <div className="next-reminder">
              <Badge tone="info">{nextReminder.type}</Badge>
              <strong>{nextReminder.title}</strong>
              <span>{nextReminder.time} · {nextReminder.repeat}</span>
            </div>
          ) : (
            <EmptyState title="Sin recordatorios activos" text="Crea recordatorios para medición, insulina, medicamentos o citas." />
          )}
        </Card>
      </div>
    </div>
  );
}
