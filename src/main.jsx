import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import { App } from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error(
    'Root element #root not found. Make sure index-react.html has <div id="root">.'
  );
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
