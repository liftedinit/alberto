import { useContext } from "react";
import omni from "omni";
import { useNavigate, Link } from "react-router-dom";

import { StoreContext } from "../store";
import { displayNotification } from "../helper/common"
import Header from "../components/Header";
import Page from "../components/Page";
import Button from "../components/Button";

function ConfirmView() {
  const navigate = useNavigate();
  const { dispatch, state } = useContext(StoreContext);
  const txn = state.transactions.newTransaction;

  const activeAccount = state.accounts.byId.get(state.accounts.activeId)!;
  const activeServer = state.servers.byId.get(state.servers.activeId)!;
  const receiver = state.receivers.byId.get(txn.receiverId!)!;
  const idString = receiver ? omni.identity.toString(receiver.identity) : "oaa";
  
  const handleConfirm = async () => {
    try {      
      const s:any = txn.symbol
      const symbolIdentity = omni.identity.fromString(s)

      const server = omni.server.connect(activeServer.url);
      await server.ledgerSend(
        receiver.identity!,
        txn.amount,
        symbolIdentity!,
        activeAccount.keys!
      );
      dispatch({ type: "TRANSACTION.SENT" });
      navigate("/");
    } catch (e) {
      displayNotification(e)
    }
  };

  return (
    <Page>
      <Header>
        <Header.Right>
          <Link to="/send">Back</Link>
        </Header.Right>
      </Header>

      <label>Server</label>
      <p className="Box">{activeServer.name}</p>

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
