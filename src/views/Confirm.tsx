import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { StoreContext } from "../store";

import { Account } from "../store/accounts";
import { Transaction } from "../store/transactions";
import { parseIdentity, createSendArugments } from "../helper/common";
import omni from "omni";

function ConfirmView() {
  const navigate = useNavigate();
  const { dispatch, state } = useContext(StoreContext)  
  const transaction:Transaction = state.transactions.newTransaction  
  const [account, setAccount] = useState<string>("");

  useEffect(() => {
    const account: Account = transaction.receiver || { name: "", identity: null }
    setAccount(`${account.name} ${parseIdentity(account.identity)}`)
  },[]);

  const handleConfirm = async () => {
    // TODO here
    try {
      const data = createSendArugments(transaction);
      console.log('============================')
      console.log(data)
      console.log('============================')
      await omni.server.send(transaction.server.url, {method: "ledger.send", data})      
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
        <input disabled type="text" name="receiver" defaultValue={account} maxLength={512} style={{width: "120%"}}/>
      </p>
      <p>
        <button type="button" onClick={handleConfirm}>Confirm</button>
      </p>
    </pre>
  );
}
export default ConfirmView;
