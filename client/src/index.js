// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Still need to import it here
import './index.css';
import App from './App';
import './i18n';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* <--- THIS IS THE FIX: App MUST be nested INSIDE BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

serviceWorkerRegistration.unregister();