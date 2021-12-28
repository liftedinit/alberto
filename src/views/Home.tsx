// import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
// import omni from "omni";
// import { StoreContext } from "../store";

function HomeView() {
  // const { state } = useContext(StoreContext);
  // useEffect(() => {
  //   const fetchLedgerInfo = async () => {
  //     const activeServer = state.servers.servers.get(
  //       state.servers.activeIds.values().next().value
  //     );
  //     const activeAccount = state.accounts.accounts.get(
  //       state.accounts.activeIds.values().next().value
  //     );
  //     if (activeServer && activeAccount) {
  //       try {
  //         const [symbols] = await omni.server.send(activeServer.url, {
  //           method: "ledger.info",
  //         });
  //         const balance = await omni.server.send(
  //           activeServer.url,
  //           {
  //             method: "ledger.balance",
  //             data: `[null, "${symbols[0]}"]`,
  //           },
  //           activeAccount.identity
  //         );
  //         console.log(balance);
  //       } catch (e) {
  //         throw new Error((e as Error).message);
  //       }
  //     }
  //   };
  //   fetchLedgerInfo();
  // }, []);
  return (
    <pre>
      [HOME]
      <ul>
        <li>
          <Link to="/accounts">Accounts</Link>
        </li>
        <li>
          <Link to="/servers">Servers</Link>
        </li>
        <li>
          <Link to="/send">Send</Link>
        </li>
      </ul>
      <details>
        <summary>Symbols</summary>
        [SYMBOLS]
      </details>
      <details>
        <summary>Transactions</summary>
        [TRANSACTIONS]
      </details>
    </pre>
  );
}
export default HomeView;
