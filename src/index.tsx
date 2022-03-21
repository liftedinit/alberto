import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { UiKitProvder, QueryProvider } from "components";
import { HashRouter } from "react-router-dom";
import { StoreProvider } from "./store";
import { NetworkProvider } from "features/network";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <UiKitProvder resetCSS>
      <NetworkProvider>
        <QueryProvider>
          <StoreProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </StoreProvider>
        </QueryProvider>
      </NetworkProvider>
    </UiKitProvder>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals(console.log);
