import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';

export default function Safety({ state }) {
  const phone = state.patient.emergencyPhone;

  return (
    <div className="page-grid">
      <Card className="hero-card compact-hero">
        <p className="eyebrow">Seguridad</p>
        <h1>Alertas y cuidado</h1>
        <p>Esta pantalla centraliza reglas de seguridad, contactos y límites del producto. La salud no debería depender de recordar dónde quedó un papelito.</p>
      </Card>

      <Card title="Contacto de emergencia">
        <div className="emergency-box">
          <div>
            <span>{state.patient.emergencyName || 'No registrado'}</span>
            <strong>{phone || 'Agrega un teléfono en Perfil'}</strong>
          </div>
          {phone ? <a className="primary-button" href={`tel:${phone}`}>Llamar</a> : null}
        </div>
      </Card>

      <Card title="Reglas de seguridad de la app">
        <div className="safety-list">
          <article>
            <Badge tone="danger">No calcula dosis</Badge>
            <h3>La app registra aplicaciones de insulina, pero no recomienda cuántas unidades usar.</h3>
            <p>Cualquier dosis debe venir del plan personal definido con el equipo de salud.</p>
          </article>
          <article>
            <Badge tone="warning">Valores extremos</Badge>
            <h3>Los valores muy bajos o muy altos muestran mensajes de alerta.</h3>
            <p>La app invita a seguir el plan personal, contactar apoyo o buscar atención según síntomas y contexto.</p>
          </article>
          <article>
            <Badge tone="info">Datos sensibles</Badge>
            <h3>Los datos de salud deben protegerse con consentimiento y permisos.</h3>
            <p>Antes de usar la aplicación con pacientes, debe definirse cómo se protegerá la información, quién podrá verla y cómo se solicitará la autorización correspondiente.</p>
          </article>
        </div>
      </Card>

      <Card title="Texto sugerido de consentimiento">
        <div className="consent-box">
          <p>
            Autorizo el tratamiento de mis datos personales y datos sensibles de salud para registrar, consultar y generar reportes de seguimiento de diabetes dentro de GlucoGuía. Entiendo que esta aplicación no reemplaza atención médica, no diagnostica y no calcula dosis de insulina. Puedo solicitar eliminación o corrección de mis datos según la política de tratamiento aplicable.
          </p>
        </div>
      </Card>
    </div>
  );
}
