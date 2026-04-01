import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import theme from './theme';
import { ProcessingAreasProvider } from './context/ProcessingAreasContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ProcessingAreasProvider>
          <App />
        </ProcessingAreasProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
