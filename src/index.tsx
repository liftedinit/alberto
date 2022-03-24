import { AppProvider } from "providers/app"
import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import reportWebVitals from "./reportWebVitals"

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById("root"),
)

reportWebVitals(console.log)
