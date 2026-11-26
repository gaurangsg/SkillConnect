import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';
import './index.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#173d36', dark: '#102b27', light: '#d9f2df' },
    secondary: { main: '#a5e56a' },
    background: { default: '#f6f8f5', paper: '#ffffff' },
    text: { primary: '#172a28', secondary: '#65736f' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'Inter, Manrope, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '-0.01em' },
    h1: { fontWeight: 750, letterSpacing: '-0.055em' },
    h2: { fontWeight: 730, letterSpacing: '-0.045em' },
    h3: { fontWeight: 720, letterSpacing: '-0.035em' },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 999, paddingInline: 20, minHeight: 44, boxShadow: 'none' } } },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: 22 } } },
    MuiTextField: { defaultProps: { size: 'medium' } },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
