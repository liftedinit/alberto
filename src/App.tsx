import React, { useContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
// import localForage from "localforage";

// import { StoreContext } from "./store";
import {
  // AccountsView,
  // AddAccountView,
  // AddNetworkView,
  // AddReceiverView,
  // ConfirmView,
  // HomeView,
  // ImportPemView,
  // ImportSeedWordsView,
  // NetworksView,
  // NewAccountView,
  // SendView,
  SplashView,
  ////////////////////
  Accounts,
  AddNetwork,
  Home,
  Networks,
  AddAccount,
} from "./views";

// import "./App.css";

const ONE_SECOND = 1 * 1000;
// const STATE_KEY = "ALBERT.STATE";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  // const { state, dispatch } = useContext(StoreContext);
  React.useEffect(
    () => {
      setTimeout(() => setShowSplash(false), ONE_SECOND);
      // const loadState = async () => {
      //   try {
      //     const restoredState = await localForage.getItem(STATE_KEY);
      //     dispatch({ type: "APP.RESTORE", payload: restoredState });
      //   } catch (e) {}
      // };
      // loadState();
    },
    [
      /* dispatch */
    ]
  );

  // React.useEffect(() => {
  //   localForage.setItem(STATE_KEY, state);
  // }, [state]);

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
        <Route path="/" element={<Home />} />
        <Route path="networks" element={<Networks />} />
        <Route path="networks/add" element={<AddNetwork />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="accounts/add" element={<AddAccount />} />
        {/* <Route path="accounts" element={<AccountsView />} />
        <Route path="accounts/add" element={<AddAccountView />} />
        <Route path="accounts/add/new" element={<NewAccountView />} />
        <Route path="accounts/add/seed" element={<ImportSeedWordsView />} />
        <Route path="accounts/add/pem" element={<ImportPemView />} />
        <Route path="send" element={<SendView />} />
        <Route path="send/confirm" element={<ConfirmView />} />
        <Route path="receivers/add" element={<AddReceiverView />} /> */}
      </Routes>
    </div>
  );
}

export default App;
