import { useState } from 'react';
import Card from '../components/Card.jsx';
import { Field, SelectInput, TextArea, TextInput } from '../components/Field.jsx';
import { resetState } from '../utils/storage.js';

export default function Profile({ state, updateState }) {
  const [form, setForm] = useState(state.patient);
  const [saved, setSaved] = useState(false);

  function save(e) {
    e.preventDefault();
    updateState((prev) => ({ ...prev, patient: { ...prev.patient, ...form } }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  function clearLocalData() {
    const ok = confirm('Esto borrará definitivamente toda la información guardada en este dispositivo. ¿Deseas continuar?');
    if (!ok) return;
    resetState();
    location.reload();
  }

  return (
    <div className="page-grid">
      <Card className="hero-card compact-hero">
        <p className="eyebrow">Configuración</p>
        <h1>Perfil del paciente</h1>
        <p>Define rangos, contacto de emergencia y datos útiles para reportes. Sin esto la app adivina, y la adivinación en salud es básicamente una pésima religión.</p>
      </Card>

      {saved && <div className="toast">Perfil guardado.</div>}

      <Card title="Datos principales">
        <form className="form-grid" onSubmit={save}>
          <Field label="Nombre">
            <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Tipo de diabetes">
            <SelectInput value={form.diabetesType} onChange={(e) => setForm({ ...form, diabetesType: e.target.value })}>
              {['Tipo 1', 'Tipo 2', 'Gestacional', 'LADA', 'MODY', 'Otro'].map((item) => <option key={item}>{item}</option>)}
            </SelectInput>
          </Field>
          <Field label="Rango mínimo objetivo mg/dL">
            <TextInput type="number" value={form.targetMin} onChange={(e) => setForm({ ...form, targetMin: e.target.value })} />
          </Field>
          <Field label="Rango máximo objetivo mg/dL">
            <TextInput type="number" value={form.targetMax} onChange={(e) => setForm({ ...form, targetMax: e.target.value })} />
          </Field>
          <Field label="Contacto de emergencia">
            <TextInput value={form.emergencyName} onChange={(e) => setForm({ ...form, emergencyName: e.target.value })} />
          </Field>
          <Field label="Teléfono de emergencia">
            <TextInput value={form.emergencyPhone} onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })} />
          </Field>
          <Field label="Médico o equipo tratante">
            <TextInput value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })} />
          </Field>
          <Field label="Contacto médico">
            <TextInput value={form.doctorContact} onChange={(e) => setForm({ ...form, doctorContact: e.target.value })} />
          </Field>
          <Field label="Notas del plan personal" hint="Aquí puede ir el plan escrito por el paciente según indicaciones recibidas. La app no lo interpreta automáticamente.">
            <TextArea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
          <div className="action-row">
            <button className="primary-button" type="submit">Guardar perfil</button>
            <button className="secondary-button danger-text" type="button" onClick={clearLocalData}>Borrar todos mis datos</button>
          </div>
        </form>
      </Card>
    </div>
  );
}
