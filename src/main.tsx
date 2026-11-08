import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'

// Start MSW in development so the app can run without a backend.
if (import.meta.env.DEV) {
  // Dynamically import the worker so it is only included in dev builds.
  import('./mocks/browser').then(({ worker }) => {
    worker.start().then(() => {
      console.log('MSW worker started')
    })
  }).catch((err) => {
    console.warn('Failed to start MSW', err)
  })
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
