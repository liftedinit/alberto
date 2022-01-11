import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import omni from "omni";
import { StoreContext } from "../store";
import { getAddressFromHex } from "../helper/common";

function HomeView() {
  const { dispatch, state } = useContext(StoreContext);
  useEffect(() => {
    state.servers.activeIds.forEach((serverId) => {
      state.accounts.activeIds.forEach(async (accountId) => {
        const { url } = state.servers.byId.get(serverId)!;
        const { keys } = state.accounts.byId.get(accountId)!;

        try {          
          const server = omni.server.connect(url);

          const symbols = await server.accountInfo(keys!);
          dispatch({ type: "BALANCES.SYMBOLS", payload: symbols[0] });

          const balances = await server.accountBalance(symbols, keys!);
          dispatch({
            type: "BALANCES.UPDATE",
            payload: { serverId, balances: balances[0] },
          });

          // Get Transactions
          const transactions = await omni.server.send(url, {method: "ledger.list", data: {}});
          
          dispatch({
            type: "TRANSACTION.LIST",
            payload: transactions
          });          
        } catch (e) {
          throw new Error((e as Error).message);
        }
      });
    });
  }, [
    state.accounts.activeIds,
    state.accounts.byId,
    state.servers.activeIds,
    state.servers.byId    
  ]);
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
        <ul>
          {Array.from(state.balances.symbols, (symbol) => (
            <li key={`symbol-${symbol}`}>
              {symbol}... 
            </li>
          ))}
        </ul>
      </details>
      <details>
        <summary>Transactions</summary>
        <ul>
        {Array.from(state.transactions.byTransactionId, ([id, transaction]) => (
            <li key={`transaction-detail-${id}`}>
              From:  {getAddressFromHex(transaction.from)}<br />
              To: {getAddressFromHex(transaction.to)}<br />
              Amount: {transaction.amount.toString()} {transaction.symbol}
            </li>            
          ))}
        </ul>
      </details>
    </pre>
  );
}
export default HomeView;
