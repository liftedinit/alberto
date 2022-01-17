import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import omni from "omni";
import { StoreContext } from "../store";
import { getAddressFromHex } from "../helper/common";

import Page from "../components/Page";
import Header from "../components/Header";
import Button from "../components/Button";
import Tabs from "../components/Tabs";

function HomeView() {
  const { dispatch, state } = useContext(StoreContext);
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  const activeAccount = state.accounts.byId.get(state.accounts.activeId)!;
  const activeServer = state.servers.byId.get(state.servers.activeId)!;

  useEffect(() => {
    const fetchAccount = async () => {
      const { keys } = activeAccount;
      const { url } = activeServer;

      try {
        const server = omni.server.connect(url);

        // Get Symbols
        const symbols = await server.accountInfo(keys!);
        dispatch({ type: "BALANCES.SYMBOLS", payload: symbols[0] });

        // Get Balances if not Anonymous
        // if (keys) {
        const balances = await server.accountBalance(symbols[0], keys!);
        dispatch({
          type: "BALANCES.UPDATE",
          payload: {
            serverId: state.servers.activeId,
            balances: balances[0],
          },
        });

        // Get Transactions
        const transactions = await omni.server.send(
          url,
          { method: "ledger.list", data: {} },
          keys
        );

        dispatch({
          type: "TRANSACTION.LIST",
          payload: transactions,
        });
        // }
      } catch (e) {
        throw new Error((e as Error).message);
      }
    };
    fetchAccount();
    const fetchInterval = setInterval(fetchAccount, 2000);
    return () => {
      clearInterval(fetchInterval);
    };
  }, [dispatch, activeServer, activeAccount, state.servers.activeId]);
  return (
    <Page className="Home">
      <Header>
        <Header.Left>
          <Link to="/accounts">{activeAccount.name}</Link>
        </Header.Left>
        <Header.Right>
          <Link to="/servers">{activeServer.name}</Link>
        </Header.Right>
      </Header>
      <Tabs tab={tab}>
        <Tabs.Tab>
          {Array.from(state.balances.symbols, (symbol) => (
            <div key={symbol} className="Balance">
              <h3>{symbol}</h3>
              <h4>
                {state.balances.bySymbol.get(symbol)?.toLocaleString() || 0}
              </h4>
            </div>
          ))}
        </Tabs.Tab>
        <Tabs.Tab>
          <ul>
            {Array.from(
              state.transactions.byTransactionId,
              ([id, transaction]) => (
                <li key={`transaction-detail-${id}`}>
                  From: {getAddressFromHex(transaction.from)}
                  <br />
                  To: {getAddressFromHex(transaction.to)}
                  <br />
                  Amount: {transaction.amount.toString()} {transaction.symbol}
                </li>
              )
            )}
          </ul>
        </Tabs.Tab>
      </Tabs>
      <div className="PageTabs">
        <div
          className={`PageTab ${tab === 0 ? " active" : ""}`}
          onClick={() => setTab(0)}
        >
          Symbols
        </div>
        <div
          className={`PageTab ${tab === 1 ? " active" : ""}`}
          onClick={() => setTab(1)}
        >
          History
        </div>
      </div>
      <Button.Footer onClick={() => navigate("/send")} label="Send" />
    </Page>
  );
}
export default HomeView;
