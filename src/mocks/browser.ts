/*
 MSW browser setup for Vite + React.
 - Uses MSW 2.0 `setupWorker` from msw
 - Start the worker in development only (main.tsx will call worker.start())
*/

import { setupWorker } from 'msw'
import { handlers } from './handlers'

// Create a Service Worker with the defined handlers.
export const worker = setupWorker(...handlers)
