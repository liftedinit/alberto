import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import omni from "omni";
import { StoreContext } from "../store";

function HomeView() {
  const { dispatch, state } = useContext(StoreContext);
  useEffect(() => {
    state.servers.activeIds.forEach((serverId) => {
      state.accounts.activeIds.forEach(async (accountId) => {
        const { url } = state.servers.byId.get(serverId)!;
        
        const { identity } = state.accounts.byId.get(accountId)!;

        try {          
          const server = omni.server.connect(url);

          const accountInfo = await omni.server.send(url, {method: "account.info", data: {}});
          
          let symbols: string[] = [accountInfo[0]];          
          if (state.balances.symbols.size === 0)
            dispatch({ type: "BALANCES.SYMBOLS", payload: symbols });

          const balances = await server.ledger_balance(symbols, identity);
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
              From:  {transaction.from}<br />
              To: {transaction.to}<br />
              Amount: {transaction.amount.toString()} {transaction.symbol}
            </li>            
          ))}
        </ul>
      </details>
    </pre>
  );
}
export default HomeView;
