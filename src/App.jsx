import { useEffect, useMemo, useState } from 'react';
import Nav from './components/Nav.jsx';
import Dashboard from './pages/Dashboard.jsx';
import History from './pages/History.jsx';
import Plan from './pages/Plan.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/Register.jsx';
import Reminders from './pages/Reminders.jsx';
import Reports from './pages/Reports.jsx';
import Safety from './pages/Safety.jsx';
import { loadState, saveState } from './utils/storage.js';

export default function App() {
  const [state, setState] = useState(loadState);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    saveState(state);
  }, [state]);

  const updateState = (updater) => {
    setState((prev) => typeof updater === 'function' ? updater(prev) : updater);
  };

  const page = useMemo(() => {
    const props = { state, updateState, setActivePage };
    const pages = {
      dashboard: <Dashboard {...props} />,
      register: <Register {...props} />,
      history: <History {...props} />,
      reports: <Reports {...props} />,
      reminders: <Reminders {...props} />,
      profile: <Profile {...props} />,
      safety: <Safety {...props} />,
      plan: <Plan {...props} />
    };
    return pages[activePage] || pages.dashboard;
  }, [activePage, state]);

  return (
    <div className="app-shell">
      <Nav activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        <div className="top-bar">
          <div>
            <span className="system-status">Guardado en este dispositivo</span>
            <strong>Seguimiento de diabetes</strong>
          </div>
          <div className="safety-pill">No calcula dosis de insulina</div>
        </div>
        {page}
      </main>
    </div>
  );
}
