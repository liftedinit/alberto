// @ts-nocheck
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Network } from "many-js";
import { StoreContext } from "../store";

import Page from "../components/Page";
import Header from "../components/Header";
import Button from "../components/Button";
import Tabs from "../components/Tabs";
import DetailHeader from "../components/DetailHeader";
import HistoryDetailItem from "../components/HistoryDetailItem";

function HomeView() {
  const { dispatch, state } = useContext(StoreContext);
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  const activeAccount = state.accounts.byId.get(state.accounts.activeId)!;
  const activeNetwork = state.networks.byId.get(state.networks.activeId)!;

  useEffect(() => {
    const fetchAccount = async () => {
      const { keys } = activeAccount;
      const { url } = activeNetwork;

      try {
        const network = new Network(url, keys!);
        const info = await network.fetchLedgerInfo();
        const { symbols } = info;
        console.log({ info });

        console.log({ symbols });
        // symbols.entries()
        let entries = symbols.entries();
        const arrayEntries = Array.from(entries);
        console.log("entries", arrayEntries);

        dispatch({ type: "BALANCES.SYMBOLS", payload: arrayEntries });

        // Get Balances if not Anonymous
        // if (keys) {
        // const balances = await network.ledger.balance(symbols[0]);
        // dispatch({
        //   type: "BALANCES.UPDATE",
        //   payload: {
        //     networkId: state.networks.activeId,
        //     balances: balances,
        //   },
        // });

        // Get Transactions
        // const transactions = await network.ledger.list();

        // dispatch({
        //   type: "TRANSACTION.LIST",
        //   payload: transactions,
        // });
        // }
      } catch (e) {
        throw new Error((e as Error).message);
      }
    };
    fetchAccount();
    // const fetchInterval = setInterval(fetchAccount, 2000);
    return () => {
      // clearInterval(fetchInterval);
    };
  }, [dispatch, activeNetwork, activeAccount, state.networks.activeId]);
  console.log("state.balances.symbols", state.balances.symbols);
  return (
    <Page className="Home">
      <Header>
        <Header.Left>
          <Link to="/accounts">{activeAccount.name}</Link>
        </Header.Left>
        <Header.Right>
          <Link to="/networks">{activeNetwork.name}</Link>
        </Header.Right>
      </Header>
      <Tabs tab={tab}>
        <Tabs.Tab>
          <div className="Symbols">
            <DetailHeader type="symbols" />
            {/* {Array.from(state.balances.symbols, (symbol) => (
              <div key={symbol} className="Balance">
                <h3>{symbol}</h3>
                <h4>
                  {state.balances.bySymbol.get(symbol)?.toLocaleString() || 0}
                </h4>
              </div>
            ))} */}
          </div>
        </Tabs.Tab>
        <Tabs.Tab>
          <div className="History">
            <DetailHeader type="history" />
            <div className="HistoryContent">
              {Array.from(
                state.transactions.byTransactionId,
                ([id, transaction]) => (
                  <div key={transaction.uid}>
                    <HistoryDetailItem transaction={transaction} />
                  </div>
                )
              )}
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
