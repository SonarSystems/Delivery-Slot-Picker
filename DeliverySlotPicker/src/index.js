import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// create a root and render the app
const container = document.getElementById('root');
const root = createRoot(container); // create a root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
