export function classifyGlucose(value, patient) {
  const number = Number(value);
  const min = Number(patient?.targetMin ?? 80);
  const max = Number(patient?.targetMax ?? 180);

  if (!Number.isFinite(number)) return { label: 'Sin dato', tone: 'muted', message: '' };
  if (number < 54) return { label: 'Muy baja', tone: 'danger', message: 'Valor muy bajo registrado. Sigue tu plan de hipoglucemia y contacta apoyo si hay síntomas fuertes.' };
  if (number < min) return { label: 'Baja', tone: 'warning', message: 'Glucosa por debajo de tu rango objetivo configurado.' };
  if (number > 300) return { label: 'Muy alta', tone: 'danger', message: 'Valor muy alto registrado. Revisa tu plan personal y considera contactar a tu equipo de salud.' };
  if (number > max) return { label: 'Alta', tone: 'warning', message: 'Glucosa por encima de tu rango objetivo configurado.' };
  return { label: 'En rango', tone: 'success', message: 'Valor dentro del rango objetivo configurado.' };
}

export function getTodayLogs(logs, field = 'measuredAt') {
  const today = new Date().toISOString().slice(0, 10);
  return logs.filter((item) => String(item[field] || '').slice(0, 10) === today);
}

export function averageGlucose(logs) {
  const values = logs.map((log) => Number(log.value)).filter(Number.isFinite);
  if (!values.length) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function countOutOfRange(logs, patient) {
  const min = Number(patient?.targetMin ?? 80);
  const max = Number(patient?.targetMax ?? 180);
  return logs.reduce(
    (acc, log) => {
      const value = Number(log.value);
      if (!Number.isFinite(value)) return acc;
      if (value < min) acc.low += 1;
      if (value > max) acc.high += 1;
      if (value >= min && value <= max) acc.inRange += 1;
      return acc;
    },
    { low: 0, high: 0, inRange: 0 }
  );
}
