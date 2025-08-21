import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import './i18n';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { ThemeProvider } from "./components/ThemeContext"; // <-- Add this import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider> {/* <-- Wrap your app with ThemeProvider */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.unregister();