import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { MemoryRouter } from "react-router-dom";
import { StoreProvider } from "./store";

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
