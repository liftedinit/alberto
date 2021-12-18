import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import {
  AccountsView,
  ConfirmView,
  HomeView,
  SendView,
  ServersView,
  SplashView,
} from "./views";

function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => setShowSplash(false), 3000);
  }, []);
  if (showSplash) {
    return <SplashView />;
  }
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="accounts" element={<AccountsView />} />
        <Route path="servers" element={<ServersView />} />
        <Route path="send" element={<SendView />} />
        <Route path="confirm" element={<ConfirmView />} />
      </Routes>
    </div>
  );
}

export default App;
