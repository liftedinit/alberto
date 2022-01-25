import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import omni from "omni";
import { StoreContext } from "../store";

import Page from "../components/Page";
import Header from "../components/Header";
import Button from "../components/Button";
import Tabs from "../components/Tabs";
import DetailHeader from "../components/DetailHeader";
import HistoryDetailItem from "../components/HistoryDetailItem";

import { displayNotification } from "../helper/common";
import { Identity } from "omni/dist/identity";

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
        const accountInfo = await server.ledgerInfo();
        const symbols = accountInfo[0]
        
        let balances = null;
        if ( keys === undefined) {
          balances = await omni.server.send(url, { method: "ledger.balance", data: {}})
        } else {
          const identity: Identity = omni.identity.fromPublicKey(keys?.publicKey);
          balances = await server.ledgerBalance(identity, symbols[0], keys!)
        }        
        
        dispatch({ type: "BALANCES.SYMBOLS", payload: symbols });
        
        // Get Balances if not Anonymous                
        
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
        console.log(e)
        // displayNotification(e)
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
        <Header.Center>
          <Link to="/search">Search</Link>
        </Header.Center>
        <Header.Right>
          <Link to="/servers">{activeServer.name}</Link>
        </Header.Right>
       

      </Header>
      <Tabs tab={tab}>
        <Tabs.Tab>
          <div className="Symbols">
            <DetailHeader type='symbols' />
            {Array.from(state.balances.symbols, (symbol) => (
              <div key={symbol} className="Balance">
                <h3>{symbol}</h3>
                <h4>
                  {state.balances.bySymbol.get(symbol)?.toLocaleString() || 0}
                </h4>
              </div>
            ))}
          </div>
        </Tabs.Tab>
        <Tabs.Tab>
          <div className="History">
            <DetailHeader type='history' />
            <div className="HistoryContent">
              {Array.from(state.transactions.byTransactionId, ([id, transaction]) => (
                <div key={transaction.uid}>
                  <HistoryDetailItem
                    transaction={transaction}
                  />
                </div>
              ))}
            </div>
          </div>
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
