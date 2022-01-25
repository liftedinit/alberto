import React, { useContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import localForage from "localforage";
import { ToastContainer } from 'react-toastify';

import { StoreContext } from "./store";
import {
  AccountsView,
  AddAccountView,
  AddReceiverView,
  AddServerView,
  ConfirmView,
  HomeView,
  ImportPemView,
  ImportSeedWordsView,
  NewAccountView,
  SearchView,
  SendView,
  ServersView,
  SplashView,
} from "./views";

import "./App.css";
import 'react-toastify/dist/ReactToastify.css';

const SPLASH_DELAY = 1 * 1000;
const STATE_KEY = "ALBERT.STATE";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { state, dispatch } = useContext(StoreContext);

  React.useEffect(() => {
    setTimeout(() => setShowSplash(false), SPLASH_DELAY);
    const loadState = async () => {
      const restoredState = await localForage.getItem(STATE_KEY);
      dispatch({ type: "APP.RESTORE", payload: restoredState });
    };

//    loadState();
  }, [dispatch]);

  React.useEffect(() => {
    localForage.setItem(STATE_KEY, state);
  }, [state]);

  if (showSplash) {
    return (
      <div className="App no-header">
        <SplashView />
      </div>
    );
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
        <Route path="send/confirm" element={<ConfirmView />} />
        <Route path="receivers/add" element={<AddReceiverView />} />
        <Route path="search" element={<SearchView />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        closeOnClick
      />
    </div>
  );
}

export default App;
