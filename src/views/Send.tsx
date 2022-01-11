import React, { useState, useContext, useEffect } from "react";
import omni from "omni";
import { useNavigate, Link } from "react-router-dom";
import { StoreContext } from "../store";
import { Server } from "../store/servers";
import { Account } from "../store/accounts";
import { Receiver } from "../store/receivers";
import { Transaction } from "../store/transactions";
import { Amount } from "../store/balances";
import { parseIdentity } from "../helper/common";

function SendView() {
  const navigate = useNavigate();  
  const { dispatch, state } = useContext(StoreContext)
  
  const [server, setServer] = useState<Server>({ name: "Localhost", url: "/api" });
  const [amount, setAmount] = useState<string>("0");
  const [symbol, setSymbol] = useState<string>("FBT");
  const [receiver, setReceiver] = useState<Receiver>({name: ""});
  const [from, setFrom] = useState<Account>({name:""});
  
  useEffect(() => {    
    const receiver: Receiver = state.receivers.byId.get(state.receivers.nextId-1) || {name: ""};         
    setReceiver(receiver);

    const account: Account = state.accounts.byId.get(state.accounts.nextId-1) || {name: ""};      
    setFrom(account);
  }, [state.receivers.nextId, state.accounts.nextId]);

  const handleServer = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id: number = parseInt(event.target.value);
    const server: Server = state.servers.byId.get(id) || {name: "", url: ""};      
    setServer(server);
  }

  const handleAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount: string = event.target.value;
    setAmount(amount);  
  }

  const handleSymbol = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const symbol = event.target.value;
    setSymbol(symbol);
  }

  const handleReceiver = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id: number = parseInt(event.target.value);            
    const receiver: Receiver = state.receivers.byId.get(id) || {name: ""};          
    setReceiver(receiver);
  }
  const handleFrom = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id: number = parseInt(event.target.value);            
    const account: Account = state.accounts.byId.get(id) || {name: ""};      
    setFrom(account)
}

  const handleNext = () => {
    if (amount === "0") {
      alert('Please input amount!');
      return;
    }
    const transactionAmount: Amount = BigInt(amount);
    const transaction: Transaction = { server, amount: transactionAmount, symbol, receiver, from };

    dispatch({ type: "TRANSACTION.CREATE", payload: transaction});
    navigate("/confirm");
  };

  const handlAddeReceiver = () => {
    navigate("/receiver/add/new")
  }
 
  return (
    <pre>
      [SEND]
      <ul>
        <li>
          <Link to="/">Back</Link>
        </li>
        <li>
          <Link to="/confirm">Next</Link>
        </li>
      </ul> 
      <p>
        <label>Server:</label>      
        <select name="server" onChange={handleServer}>          
          {Array.from(state.servers.byId, ([id, server]) => (
            <option key={`server-${id}`} value={id}>{server.name}</option>
          ))}
        </select>       
      </p>   
      <p>
        <label>Amount:</label> 
        <input type="number" name="amount" onChange={handleAmount} defaultValue={amount}/>
      </p>
      <p>
        <label>Symbol:</label>        
        <select name="symbol" defaultValue={symbol} onChange={handleSymbol}>          
          {
            Array.from(state.balances.symbols, (symbol) => (
              <option key={`symbol-${symbol}`} value={symbol}>{symbol}</option>
            ))
          }       
        </select>
      </p>
      <p>
        <label>From:</label>
        <select name="from" defaultValue={state.accounts.nextId -1} onChange={handleFrom}>          
          {Array.from(state.accounts.byId, ([id, account]) => (            
            <option key={`from-${id}`} value={id}> {account.name} 
            {' '} {`${parseIdentity(account.keys?.publicKey)}`}</option>
          ))}
        </select>
      </p>
      <p>
        <label>Receiver:</label>
        <select name="receiver" defaultValue={state.receivers.nextId -1} onChange={handleReceiver}>          
          {Array.from(state.receivers.byId, ([id, receiver]) => (            
            <option key={`receiver-${id}`} value={id} > {receiver.name} 
            {' '} {`<${omni.identity.toString(receiver.identity)}>`}</option>
          ))}
        </select>
      </p>
      <p style={{textAlign: "center"}}>
        <button type="button" onClick={handlAddeReceiver}>ADD A RECEIVER</button>
      </p>
      <p style={{textAlign: "center"}}>
        <button type="button" onClick={handleNext}>NEXT</button>
      </p>
    </pre>
  );
}
export default SendView;
