import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (error) {
  console.error('Initial render error:', error);
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; color: white; background: #1a1a1a; height: 100vh; font-family: sans-serif;">
      <h1>Application Error</h1>
      <p>Something went wrong while starting the app.</p>
      <pre style="background: #333; padding: 10px; border-radius: 5px; overflow: auto;">${error.message}</pre>
      <button onclick="location.reload()" style="padding: 10px 20px; background: #6366f1; border: none; color: white; border-radius: 5px; cursor: pointer;">Try Refreshing</button>
    </div>
  `;
}
