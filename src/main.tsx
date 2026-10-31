import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {PolicyPage, POLICY_ROUTES} from './components/PolicyPage';
import './index.css';

const path = window.location.pathname.replace(/\/+$/, '') as keyof typeof POLICY_ROUTES;
const policy = POLICY_ROUTES[path];

createRoot(document.getElementById('root')!).render(policy ? <PolicyPage page={policy} /> : <App />);
