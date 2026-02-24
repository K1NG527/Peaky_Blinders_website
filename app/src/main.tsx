import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CharacterProvider } from '@/context/CharacterContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CharacterProvider>
      <App />
    </CharacterProvider>
  </StrictMode>
);
