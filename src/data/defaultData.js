export const DEFAULT_PATIENT = {
  name: 'Paciente demo',
  diabetesType: 'Tipo 1',
  targetMin: 80,
  targetMax: 180,
  emergencyName: 'Contacto de emergencia',
  emergencyPhone: '',
  doctorName: '',
  doctorContact: '',
  notes: 'Esta app no calcula dosis ni reemplaza indicaciones médicas.'
};

export const DEFAULT_STATE = {
  patient: DEFAULT_PATIENT,
  glucoseLogs: [
    {
      id: crypto.randomUUID(),
      value: 105,
      context: 'ayunas',
      measuredAt: new Date().toISOString().slice(0, 16),
      symptoms: '',
      notes: 'Registro de ejemplo'
    }
  ],
  insulinLogs: [],
  medicationLogs: [],
  mealLogs: [],
  reminders: [
    {
      id: crypto.randomUUID(),
      type: 'glucosa',
      title: 'Medición en ayunas',
      time: '07:30',
      repeat: 'Diario',
      active: true
    },
    {
      id: crypto.randomUUID(),
      type: 'insulina',
      title: 'Insulina basal',
      time: '21:00',
      repeat: 'Diario',
      active: true
    }
  ]
};

export const glucoseContexts = [
  'ayunas',
  'antes de comer',
  'después de comer',
  'antes de dormir',
  'síntomas',
  'ejercicio',
  'otro'
];

export const insulinTypes = [
  'rápida',
  'ultrarrápida',
  'intermedia',
  'lenta/basal',
  'mixta',
  'otra'
];

export const injectionSites = ['abdomen', 'brazo', 'pierna', 'glúteo', 'otro'];
