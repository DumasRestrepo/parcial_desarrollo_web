// Libraries
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// App
import App from './App';

// Context
import { ThemeProvider } from './context/ThemeContext';

// Styles
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
