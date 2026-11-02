import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Docs } from '../pages/Docs.js';
import '../styles/tokens.css';
import '../styles/site.css';
import '../styles/mote.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Docs />
  </StrictMode>,
);
