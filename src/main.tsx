import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CookiesProvider } from "react-cookie";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './index.css'
import App from './App.tsx'
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
