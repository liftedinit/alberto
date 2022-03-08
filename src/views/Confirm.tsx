import { useContext } from "react";
import { Network } from "many";
import { useNavigate, Link } from "react-router-dom";

import { StoreContext } from "../store";

import Header from "../components/Header";
import Page from "../components/Page";
import Button from "../components/Button";

function ConfirmView() {
  const navigate = useNavigate();
  const { dispatch, state } = useContext(StoreContext);
  const txn = state.transactions.newTransaction;

  const activeAccount = state.accounts.byId.get(state.accounts.activeId)!;
  const activeNetwork = state.networks.byId.get(state.networks.activeId)!;
  const receiver = state.receivers.byId.get(txn.receiverId!)!;
  const idString = receiver.identity.toString();

  const handleConfirm = async () => {
    try {
      const network = new Network(activeNetwork.url, activeAccount.keys!);
      await network.ledger.send(receiver.identity!, txn.amount, txn.symbol!);
      dispatch({ type: "TRANSACTION.SENT" });
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Page>
      <Header>
        <Header.Right>
          <Link to="/send">Back</Link>
        </Header.Right>
      </Header>

      <label>Network</label>
      <p className="Box">{activeNetwork.name}</p>

      <label>Amount</label>
      <p className="Box">{txn.amount.toString()}</p>

      <label>Symbol</label>
      <p className="Box">{txn.symbol}</p>

      <label>From</label>
      <p className="Box">{activeAccount.name}</p>

      <label>To</label>
      <p className="Box">
        {`${receiver ? receiver.name : ""} <${idString.slice(
          0,
          4
        )}...${idString.slice(-4)}>`}
      </p>

      <Button.Footer label="Confirm" onClick={handleConfirm} />
    </Page>
  );
}
export default ConfirmView;
