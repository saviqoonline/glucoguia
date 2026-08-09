import { useState } from 'react';
import { Activity, Bell, ClipboardList, FileText, HeartPulse, Home, MoreHorizontal, Syringe, UserRound, X } from 'lucide-react';

const items = [
  { id: 'dashboard', label: 'Inicio', icon: Home },
  { id: 'register', label: 'Registrar', icon: HeartPulse },
  { id: 'history', label: 'Historial', icon: ClipboardList },
  { id: 'reports', label: 'Reportes', icon: FileText },
  { id: 'reminders', label: 'Recordatorios', icon: Bell },
  { id: 'profile', label: 'Perfil', icon: UserRound },
  { id: 'safety', label: 'Seguridad', icon: Activity },
  { id: 'plan', label: 'Plan', icon: Syringe }
];

export default function Nav({ activePage, setActivePage }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const primaryIds = new Set(['dashboard', 'register', 'history', 'reminders']);

  const navigate = (id) => {
    setActivePage(id);
    setMoreOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="side-nav">
      <div className="brand">
        <div className="brand-mark">G</div>
        <div>
          <strong>GlucoGuía</strong>
          <span>MVP diabetes</span>
        </div>
      </div>
      <div className="nav-list">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${primaryIds.has(item.id) ? 'mobile-primary' : 'mobile-secondary'} ${activePage === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.id)}
              type="button"
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button
          aria-expanded={moreOpen}
          aria-label={moreOpen ? 'Cerrar más opciones' : 'Mostrar más opciones'}
          className={`nav-item mobile-more ${moreOpen || !primaryIds.has(activePage) ? 'active' : ''}`}
          onClick={() => setMoreOpen((open) => !open)}
          type="button"
        >
          {moreOpen ? <X size={20} /> : <MoreHorizontal size={20} />}
          <span>Más</span>
        </button>
      </div>
      {moreOpen && <button className="nav-scrim" aria-label="Cerrar menú" onClick={() => setMoreOpen(false)} type="button" />}
    </nav>
  );
}
