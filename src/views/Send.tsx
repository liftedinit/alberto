import React, { useContext } from "react";
import omni from "omni";
import { useNavigate, Link } from "react-router-dom";

import { StoreContext } from "../store";

import Header from "../components/Header";
import Button from "../components/Button";
import Page from "../components/Page";
import Select from "../components/Select";
import Input from "../components/Input";

function SendView() {
  const navigate = useNavigate();
  const { dispatch, state } = useContext(StoreContext);
  const txn = state.transactions.newTransaction;

  const handleAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = BigInt(event.target.value);
    dispatch({ type: "TRANSACTION.CREATE", payload: { ...txn, amount } });
  };

  const handleSymbol = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const symbol = event.target.value;
    dispatch({ type: "TRANSACTION.CREATE", payload: { ...txn, symbol } });
  };

  const handleReceiver = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const receiverId = parseInt(event.target.value);
    dispatch({ type: "TRANSACTION.CREATE", payload: { ...txn, receiverId } });
  };

  return (
    <Page>
      <Header>
        <Header.Right>
          <Link to="/">Back</Link>
        </Header.Right>
      </Header>

      <Input
        name="amount"
        label="Amount"
        onChange={handleAmount}
        type="number"
        defaultValue={parseInt(txn.amount.toString())}
      />

      <Select
        name="symbol"
        label="Symbol"
        onChange={handleSymbol}
        options={Array.from(state.balances.symbols, (symbol) => ({
          label: symbol,
          value: symbol,
        }))}
        defaultValue={txn.symbol}
      />

      <Select
        name="receiverId"
        onChange={handleReceiver}
        label="To"
        options={Array.from(state.receivers.byId, ([id, receiver]) => {
          const idString = omni.identity.toString(receiver.identity);
          return {
            label: `${receiver.name} <${idString.slice(
              0,
              4
            )}...${idString.slice(-4)}>`,
            value: id,
          };
        })}
        defaultValue={txn.receiverId}
      />

      <Button
        label="Add a Receiver"
        onClick={() => navigate("/receivers/add")}
      />

      <Button.Footer onClick={() => navigate("/send/confirm")} label="Next" />
    </Page>
  );
}
export default SendView;
