import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';

export default function Plan({ state }) {
  const { patient, reminders } = state;
  const insulinReminders = reminders.filter((r) => r.type === 'insulina');
  const glucoseReminders = reminders.filter((r) => r.type === 'glucosa');

  return (
    <div className="page-grid">
      <Card className="hero-card compact-hero">
        <p className="eyebrow">Plan personal</p>
        <h1>Tratamiento y rutina</h1>
        <p>Vista de lectura del plan registrado. La app muestra, ordena y recuerda; no interpreta dosis porque no queremos que un componente React se crea médico.</p>
      </Card>

      <Card title="Rangos y notas">
        <div className="profile-summary">
          <div><span>Rango objetivo</span><strong>{patient.targetMin}–{patient.targetMax} mg/dL</strong></div>
          <div><span>Tipo de diabetes</span><strong>{patient.diabetesType}</strong></div>
          <div><span>Médico</span><strong>{patient.doctorName || 'No registrado'}</strong></div>
          <div><span>Contacto médico</span><strong>{patient.doctorContact || 'No registrado'}</strong></div>
        </div>
        {patient.notes && <div className="note-box"><p>{patient.notes}</p></div>}
      </Card>

      <div className="two-columns">
        <Card title="Recordatorios de glucosa">
          {glucoseReminders.length ? glucoseReminders.map((item) => (
            <div className="simple-row" key={item.id}>
              <Badge tone={item.active ? 'info' : 'muted'}>{item.active ? 'activo' : 'pausado'}</Badge>
              <strong>{item.title}</strong>
              <span>{item.time} · {item.repeat}</span>
            </div>
          )) : <p className="muted-text">No hay recordatorios de glucosa.</p>}
        </Card>

        <Card title="Recordatorios de insulina">
          {insulinReminders.length ? insulinReminders.map((item) => (
            <div className="simple-row" key={item.id}>
              <Badge tone={item.active ? 'purple' : 'muted'}>{item.active ? 'activo' : 'pausado'}</Badge>
              <strong>{item.title}</strong>
              <span>{item.time} · {item.repeat}</span>
            </div>
          )) : <p className="muted-text">No hay recordatorios de insulina.</p>}
        </Card>
      </div>
    </div>
  );
}
