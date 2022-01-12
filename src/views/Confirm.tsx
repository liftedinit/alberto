import { useState, useContext, useEffect } from "react";
import omni from "omni";
import { useNavigate, Link } from "react-router-dom";

import { StoreContext } from "../store";
import { Receiver } from "../store/receivers";
import { Transaction } from "../store/transactions";

import Header from "../components/Header";
import Page from "../components/Page";
import Button from "../components/Button";

function ConfirmView() {
  const navigate = useNavigate();
  const { dispatch, state } = useContext(StoreContext);
  const transaction: Transaction = state.transactions.newTransaction;
  const [account, setAccount] = useState<string>("");

  useEffect(() => {
    const receiver: Receiver = transaction.receiver || {
      name: "",
      address: "",
    };
    setAccount(
      `${receiver.name} <${omni.identity.toString(receiver.identity)}>`
    );
  }, []);

  const handleConfirm = async () => {
    try {
      const server = omni.server.connect(transaction.server.url);
      const to: any = transaction.receiver.identity;
      const keys: any = transaction.from?.keys;

      await server.accountSend(
        to,
        transaction.amount,
        transaction.symbol,
        keys
      );
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

      <label>Server</label>
      <p className="Box">{transaction.server.name}</p>

      <label>Amount</label>
      <p className="Box">{transaction.amount.toString()}</p>

      <label>Symbol</label>
      <p className="Box">{transaction.symbol}</p>

      <label>From</label>
      <p className="Box">{transaction.amount.toString()}</p>

      <label>Receiver</label>
      <p className="Box">{account}</p>

      <Button.Footer label="Confirm" onClick={handleConfirm} />
    </Page>
  );
}
export default ConfirmView;
