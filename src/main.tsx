import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Register PWA service worker update handler so new deployments take control immediately
try {
  // virtual:pwa-register is provided by vite-plugin-pwa
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { registerSW } = await import('virtual:pwa-register');
  const updateSW = registerSW({
    onNeedRefresh() {
      // apply update immediately
      updateSW(true).catch(() => {});
    },
  });
} catch (e) {
  // no-op if PWA plugin not present
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
