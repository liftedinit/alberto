import { App, AppProvider } from "views"
import React from "react"
import ReactDOM from "react-dom"
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
