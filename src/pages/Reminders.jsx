import { useState } from 'react';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { Field, SelectInput, TextInput } from '../components/Field.jsx';

export default function Reminders({ state, updateState }) {
  const [form, setForm] = useState({ type: 'glucosa', title: '', time: '08:00', repeat: 'Diario', active: true });

  function addReminder(e) {
    e.preventDefault();
    updateState((prev) => ({ ...prev, reminders: [{ id: crypto.randomUUID(), ...form }, ...prev.reminders] }));
    setForm({ type: 'glucosa', title: '', time: '08:00', repeat: 'Diario', active: true });
  }

  function toggleReminder(id) {
    updateState((prev) => ({ ...prev, reminders: prev.reminders.map((r) => r.id === id ? { ...r, active: !r.active } : r) }));
  }

  function deleteReminder(id) {
    updateState((prev) => ({ ...prev, reminders: prev.reminders.filter((r) => r.id !== id) }));
  }

  return (
    <div className="page-grid">
      <Card className="hero-card compact-hero">
        <p className="eyebrow">Rutina</p>
        <h1>Recordatorios</h1>
        <p>Programa mediciones, insulina, medicamentos o citas. Esta versión los guarda en la app; las notificaciones push quedan listas para una siguiente fase.</p>
      </Card>

      <div className="two-columns align-start">
        <Card title="Crear recordatorio">
          <form className="form-grid" onSubmit={addReminder}>
            <Field label="Tipo">
              <SelectInput value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {['glucosa', 'insulina', 'medicamento', 'cita', 'insumos', 'otro'].map((item) => <option key={item}>{item}</option>)}
              </SelectInput>
            </Field>
            <Field label="Título">
              <TextInput required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ej. medir glucosa antes de almorzar" />
            </Field>
            <Field label="Hora">
              <TextInput type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </Field>
            <Field label="Repetición">
              <SelectInput value={form.repeat} onChange={(e) => setForm({ ...form, repeat: e.target.value })}>
                {['Diario', 'Lunes a viernes', 'Semanal', 'Mensual', 'Una vez'].map((item) => <option key={item}>{item}</option>)}
              </SelectInput>
            </Field>
            <button className="primary-button" type="submit">Guardar recordatorio</button>
          </form>
        </Card>

        <Card title="Activos y programados">
          {state.reminders.length ? (
            <div className="reminder-list">
              {state.reminders.map((reminder) => (
                <article className={`reminder-item ${!reminder.active ? 'disabled' : ''}`} key={reminder.id}>
                  <div>
                    <Badge tone={reminder.active ? 'info' : 'muted'}>{reminder.type}</Badge>
                    <h3>{reminder.title}</h3>
                    <p>{reminder.time} · {reminder.repeat}</p>
                  </div>
                  <div className="stack-buttons">
                    <button className="ghost-button" onClick={() => toggleReminder(reminder.id)} type="button">{reminder.active ? 'Pausar' : 'Activar'}</button>
                    <button className="ghost-button danger-text" onClick={() => deleteReminder(reminder.id)} type="button">Eliminar</button>
                  </div>
                </article>
              ))}
            </div>
          ) : <EmptyState title="Sin recordatorios" />}
        </Card>
      </div>
    </div>
  );
}
