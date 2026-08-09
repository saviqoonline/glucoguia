import { DEFAULT_STATE } from '../data/defaultData.js';

const STORAGE_KEY = 'glucoguia-state-v1';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch (error) {
    console.warn('No se pudo leer localStorage:', error);
    return DEFAULT_STATE;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('No se pudo guardar localStorage:', error);
  }
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
}

export function downloadBackup(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `copia-seguridad-glucoguia-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function readBackup(file) {
  const restored = JSON.parse(await file.text());
  if (!restored || typeof restored !== 'object' || Array.isArray(restored)) {
    throw new Error('La copia no contiene datos válidos.');
  }

  return {
    ...DEFAULT_STATE,
    ...restored,
    patient: { ...DEFAULT_STATE.patient, ...(restored.patient || {}) }
  };
}
