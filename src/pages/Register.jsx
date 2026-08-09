import { useState } from 'react';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';
import { Field, SelectInput, TextArea, TextInput } from '../components/Field.jsx';
import { glucoseContexts, injectionSites, insulinTypes } from '../data/defaultData.js';
import { classifyGlucose } from '../utils/health.js';

const nowInput = () => new Date().toISOString().slice(0, 16);

export default function Register({ state, updateState }) {
  const [tab, setTab] = useState('glucose');
  const [glucose, setGlucose] = useState({ value: '', context: 'ayunas', measuredAt: nowInput(), symptoms: '', notes: '' });
  const [insulin, setInsulin] = useState({ insulinName: '', insulinType: 'rápida', doseUnits: '', appliedAt: nowInput(), injectionSite: 'abdomen', notes: '' });
  const [medication, setMedication] = useState({ medicationName: '', dose: '', takenAt: nowInput(), notes: '' });
  const [meal, setMeal] = useState({ mealType: 'desayuno', description: '', estimatedCarbs: '', eatenAt: nowInput(), notes: '' });
  const [message, setMessage] = useState('');

  function addLog(collection, value, reset) {
    updateState((prev) => ({
      ...prev,
      [collection]: [{ id: crypto.randomUUID(), ...value }, ...(prev[collection] || [])]
    }));
    reset();
    setMessage('Registro guardado. El Excel del cuerpo humano descansa un segundo.');
    setTimeout(() => setMessage(''), 2600);
  }

  const glucoseStatus = glucose.value ? classifyGlucose(glucose.value, state.patient) : null;

  return (
    <div className="page-grid">
      <Card className="hero-card compact-hero">
        <p className="eyebrow">Nuevo registro</p>
        <h1>Registra lo importante</h1>
        <p>Glucosa, insulina, medicamentos y comidas en un solo lugar. Sin calcular dosis, porque eso no se improvisa con JavaScript y fe.</p>
      </Card>

      <div className="tabs">
        {[
          ['glucose', 'Glucosa'],
          ['insulin', 'Insulina'],
          ['medication', 'Medicamento'],
          ['meal', 'Comida']
        ].map(([id, label]) => (
          <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)} type="button">{label}</button>
        ))}
      </div>

      {message && <div className="toast">{message}</div>}

      {tab === 'glucose' && (
        <Card title="Medición de glucosa" subtitle={`Rango objetivo actual: ${state.patient.targetMin}–${state.patient.targetMax} mg/dL`}>
          <form className="form-grid" onSubmit={(e) => {
            e.preventDefault();
            addLog('glucoseLogs', glucose, () => setGlucose({ value: '', context: 'ayunas', measuredAt: nowInput(), symptoms: '', notes: '' }));
          }}>
            <Field label="Valor mg/dL">
              <TextInput required type="number" min="20" max="700" value={glucose.value} onChange={(e) => setGlucose({ ...glucose, value: e.target.value })} placeholder="Ej. 105" />
            </Field>
            <Field label="Contexto">
              <SelectInput value={glucose.context} onChange={(e) => setGlucose({ ...glucose, context: e.target.value })}>
                {glucoseContexts.map((item) => <option key={item}>{item}</option>)}
              </SelectInput>
            </Field>
            <Field label="Fecha y hora">
              <TextInput type="datetime-local" value={glucose.measuredAt} onChange={(e) => setGlucose({ ...glucose, measuredAt: e.target.value })} />
            </Field>
            {glucoseStatus && (
              <div className="status-box">
                <Badge tone={glucoseStatus.tone}>{glucoseStatus.label}</Badge>
                <p>{glucoseStatus.message}</p>
              </div>
            )}
            <Field label="Síntomas">
              <TextInput value={glucose.symptoms} onChange={(e) => setGlucose({ ...glucose, symptoms: e.target.value })} placeholder="Ej. mareo, temblor, cansancio" />
            </Field>
            <Field label="Notas">
              <TextArea value={glucose.notes} onChange={(e) => setGlucose({ ...glucose, notes: e.target.value })} placeholder="Algo que explique el registro" />
            </Field>
            <button className="primary-button" type="submit">Guardar glucosa</button>
          </form>
        </Card>
      )}

      {tab === 'insulin' && (
        <Card title="Aplicación de insulina" subtitle="Registro manual. No calcula dosis ni sugiere correcciones.">
          <form className="form-grid" onSubmit={(e) => {
            e.preventDefault();
            addLog('insulinLogs', insulin, () => setInsulin({ insulinName: '', insulinType: 'rápida', doseUnits: '', appliedAt: nowInput(), injectionSite: 'abdomen', notes: '' }));
          }}>
            <Field label="Nombre de insulina">
              <TextInput required value={insulin.insulinName} onChange={(e) => setInsulin({ ...insulin, insulinName: e.target.value })} placeholder="Ej. Humalog, Lantus" />
            </Field>
            <Field label="Tipo">
              <SelectInput value={insulin.insulinType} onChange={(e) => setInsulin({ ...insulin, insulinType: e.target.value })}>
                {insulinTypes.map((item) => <option key={item}>{item}</option>)}
              </SelectInput>
            </Field>
            <Field label="Dosis aplicada en unidades">
              <TextInput required type="number" min="0" step="0.5" value={insulin.doseUnits} onChange={(e) => setInsulin({ ...insulin, doseUnits: e.target.value })} placeholder="Ej. 8" />
            </Field>
            <Field label="Fecha y hora">
              <TextInput type="datetime-local" value={insulin.appliedAt} onChange={(e) => setInsulin({ ...insulin, appliedAt: e.target.value })} />
            </Field>
            <Field label="Zona de aplicación">
              <SelectInput value={insulin.injectionSite} onChange={(e) => setInsulin({ ...insulin, injectionSite: e.target.value })}>
                {injectionSites.map((item) => <option key={item}>{item}</option>)}
              </SelectInput>
            </Field>
            <Field label="Notas">
              <TextArea value={insulin.notes} onChange={(e) => setInsulin({ ...insulin, notes: e.target.value })} placeholder="Ej. dosis programada, corrección indicada, molestia en zona" />
            </Field>
            <button className="primary-button" type="submit">Guardar insulina</button>
          </form>
        </Card>
      )}

      {tab === 'medication' && (
        <Card title="Medicamento" subtitle="Para registrar tomas de medicamentos indicados.">
          <form className="form-grid" onSubmit={(e) => {
            e.preventDefault();
            addLog('medicationLogs', medication, () => setMedication({ medicationName: '', dose: '', takenAt: nowInput(), notes: '' }));
          }}>
            <Field label="Medicamento">
              <TextInput required value={medication.medicationName} onChange={(e) => setMedication({ ...medication, medicationName: e.target.value })} placeholder="Ej. metformina" />
            </Field>
            <Field label="Dosis">
              <TextInput value={medication.dose} onChange={(e) => setMedication({ ...medication, dose: e.target.value })} placeholder="Ej. 500 mg" />
            </Field>
            <Field label="Fecha y hora">
              <TextInput type="datetime-local" value={medication.takenAt} onChange={(e) => setMedication({ ...medication, takenAt: e.target.value })} />
            </Field>
            <Field label="Notas">
              <TextArea value={medication.notes} onChange={(e) => setMedication({ ...medication, notes: e.target.value })} />
            </Field>
            <button className="primary-button" type="submit">Guardar medicamento</button>
          </form>
        </Card>
      )}

      {tab === 'meal' && (
        <Card title="Comida" subtitle="Registro simple para relacionar comida, glucosa y rutina.">
          <form className="form-grid" onSubmit={(e) => {
            e.preventDefault();
            addLog('mealLogs', meal, () => setMeal({ mealType: 'desayuno', description: '', estimatedCarbs: '', eatenAt: nowInput(), notes: '' }));
          }}>
            <Field label="Tipo de comida">
              <SelectInput value={meal.mealType} onChange={(e) => setMeal({ ...meal, mealType: e.target.value })}>
                {['desayuno', 'almuerzo', 'cena', 'snack', 'otro'].map((item) => <option key={item}>{item}</option>)}
              </SelectInput>
            </Field>
            <Field label="Descripción">
              <TextArea required value={meal.description} onChange={(e) => setMeal({ ...meal, description: e.target.value })} placeholder="Ej. arroz, pollo, ensalada, jugo" />
            </Field>
            <Field label="Carbohidratos estimados opcional">
              <TextInput type="number" min="0" value={meal.estimatedCarbs} onChange={(e) => setMeal({ ...meal, estimatedCarbs: e.target.value })} placeholder="Ej. 45 g" />
            </Field>
            <Field label="Fecha y hora">
              <TextInput type="datetime-local" value={meal.eatenAt} onChange={(e) => setMeal({ ...meal, eatenAt: e.target.value })} />
            </Field>
            <Field label="Notas">
              <TextArea value={meal.notes} onChange={(e) => setMeal({ ...meal, notes: e.target.value })} />
            </Field>
            <button className="primary-button" type="submit">Guardar comida</button>
          </form>
        </Card>
      )}
    </div>
  );
}
