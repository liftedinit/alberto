import { useState, useContext, useEffect } from "react";
import omni from "omni";
import { useNavigate, Link } from "react-router-dom";
import { StoreContext } from "../store";
import { Receiver } from "../store/receivers";
import { Transaction } from "../store/transactions";

function ConfirmView() {
  const navigate = useNavigate();
  const { dispatch, state } = useContext(StoreContext)
  const transaction:Transaction = state.transactions.newTransaction
  const [account, setAccount] = useState<string>("");

  useEffect(() => {
    const receiver: Receiver = transaction.receiver || { name: "", address: "" }
    console.log(transaction.receiver)
    setAccount(`${receiver.name} <${omni.identity.toString(receiver.identity)}>`)
  },[]);

  const handleConfirm = async () => {
    try {
      const server = omni.server.connect(transaction.server.url)
      const to: any  = transaction.receiver.identity;
      const keys: any = transaction.from?.keys

      await server.accountSend(to, transaction.amount, transaction.symbol, keys )
      dispatch({type: "TRANSACTION.SENT"});
      navigate("/send");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <pre>
      [CONFIRM]
      <ul>
        <li>
          <Link to="/send">Back</Link>
        </li>
        <li>
          <Link to="/">Confirm</Link>
        </li>
      </ul>
      <p>
        <label>Server:</label>
        <input disabled type="text" name="server" defaultValue={transaction.server.name}/>
      </p>
      <p>
        <label>Amount:</label>
        <input disabled type="number" name="amount" defaultValue={transaction.amount.toString()}/>
      </p>
      <p>
        <label>Symbol:</label>
        <input disabled type="text" name="symbol" defaultValue={transaction.symbol}/>
      </p>
      <p>
        <label>Receiver:</label>
        <input disabled type="text" name="receiver" defaultValue={account} maxLength={512} style={{width: "50%"}}/>
      </p>
      <p>
        <button type="button" onClick={handleConfirm}>Confirm</button>
      </p>
    </pre>
  );
}
export default ConfirmView;
