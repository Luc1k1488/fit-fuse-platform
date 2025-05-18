
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Загрузка скриптов для PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceWorker.js')
      .then(registration => {
        console.log('ServiceWorker зарегистрирован успешно:', registration.scope);
      })
      .catch(error => {
        console.log('Ошибка при регистрации ServiceWorker:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
