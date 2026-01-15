import "./polyfills"

import { App, AppProvider } from "views"
import React from "react"
import { createRoot } from "react-dom/client"
import reportWebVitals from "./reportWebVitals"

const container = document.getElementById("root")!
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)

reportWebVitals(console.log)
