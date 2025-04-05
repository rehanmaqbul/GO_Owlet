
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'

// This ensures the app mounts properly even when opened in a new tab
const rootElement = document.getElementById("root");
if (!rootElement) {
  // Create the root element if it doesn't exist
  const newRoot = document.createElement("div");
  newRoot.id = "root";
  document.body.appendChild(newRoot);
  
  createRoot(newRoot).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
