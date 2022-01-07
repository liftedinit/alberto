import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import {
  AccountsView,
  AddAccountView,
  AddServerView,
  ConfirmView,
  HomeView,
  ImportPemView,
  ImportSeedWordsView,
  NewAccountView,
  SendView,
  ServersView,
  SplashView,
  NewReceiverView,
} from "./views";

const SPLASH_DELAY = 1 * 1000;

function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => setShowSplash(false), SPLASH_DELAY);
  }, []);
  if (showSplash) {
    return <SplashView />;
  }
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="accounts" element={<AccountsView />} />
        <Route path="accounts/add" element={<AddAccountView />} />
        <Route path="accounts/add/new" element={<NewAccountView />} />
        <Route path="accounts/add/seed" element={<ImportSeedWordsView />} />
        <Route path="accounts/add/pem" element={<ImportPemView />} />
        <Route path="servers" element={<ServersView />} />
        <Route path="servers/add" element={<AddServerView />} />
        <Route path="send" element={<SendView />} />
        <Route path="confirm" element={<ConfirmView />} />
        <Route path="receiver/add/new" element={<NewReceiverView />} />
      </Routes>
    </div>
  );
}

export default App;
