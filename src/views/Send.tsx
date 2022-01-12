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

import Header from "../components/Header";
import Button from "../components/Button";
import Page from "../components/Page";
import Select from "../components/Select";
import Input from "../components/Input";

function SendView() {
  const navigate = useNavigate();
  const { dispatch, state } = useContext(StoreContext);

  const [server, setServer] = useState<Server>({
    name: "Localhost",
    url: "/api",
  });
  const [amount, setAmount] = useState<string>("0");
  const [symbol, setSymbol] = useState<string>("FBT");
  const [receiver, setReceiver] = useState<Receiver>({ name: "" });
  const [from, setFrom] = useState<Account>({ name: "" });

  useEffect(() => {
    const receiver: Receiver = state.receivers.byId.get(
      state.receivers.nextId - 1
    ) || { name: "" };
    setReceiver(receiver);

    const account: Account = state.accounts.byId.get(
      state.accounts.nextId - 1
    ) || { name: "" };
    setFrom(account);
  }, [
    state.receivers.byId,
    state.receivers.nextId,
    state.accounts.byId,
    state.accounts.nextId,
  ]);

  const handleServer = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id: number = parseInt(event.target.value);
    const server: Server = state.servers.byId.get(id) || { name: "", url: "" };
    setServer(server);
  };

  const handleAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount: string = event.target.value;
    setAmount(amount);
  };

  const handleSymbol = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const symbol = event.target.value;
    setSymbol(symbol);
  };

  const handleReceiver = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id: number = parseInt(event.target.value);
    const receiver: Receiver = state.receivers.byId.get(id) || { name: "" };
    setReceiver(receiver);
  };
  const handleFrom = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id: number = parseInt(event.target.value);
    const account: Account = state.accounts.byId.get(id) || { name: "" };
    setFrom(account);
  };

  const handleNext = () => {
    if (amount === "0") {
      alert("Please input amount!");
      return;
    }
    const transactionAmount: Amount = BigInt(amount);
    const transaction: Transaction = {
      server,
      amount: transactionAmount,
      symbol,
      receiver,
      from,
    };

    dispatch({ type: "TRANSACTION.CREATE", payload: transaction });
    navigate("/send/confirm");
  };

  return (
    <Page>
      <Header>
        <Header.Right>
          <Link to="/">Back</Link>
        </Header.Right>
      </Header>

      <Select
        name="server"
        label="Server"
        onChange={handleServer}
        options={Array.from(state.servers.byId, ([id, server]) => ({
          label: server.name,
          value: id,
        }))}
      />

      <Input
        name="amount"
        label="Amount"
        onChange={handleAmount}
        type="number"
        defaultValue={amount}
      />

      <Select
        name="symbol"
        label="Symbol"
        onChange={handleSymbol}
        options={Array.from(state.balances.symbols, (symbol) => ({
          label: symbol,
          value: symbol,
        }))}
      />

      <Select
        name="from"
        label="Account"
        onChange={handleFrom}
        defaultValue={state.accounts.nextId - 1}
        options={Array.from(state.accounts.byId, ([id, account]) => ({
          label: `${account.name}
      ${parseIdentity(account.keys?.publicKey)}`,
          value: id,
        }))}
      />

      <Select
        name="receiver"
        onChange={handleReceiver}
        label="Receiver"
        options={Array.from(state.receivers.byId, ([id, receiver]) => ({
          label: `${receiver.name} <${omni.identity.toString(
            receiver.identity
          )}>`,
          value: id,
        }))}
      />

      <Button
        label="Add a Receiver"
        onClick={() => navigate("/receivers/add")}
      />

      <Button.Footer onClick={handleNext} label="Next" />
    </Page>
  );
}
export default SendView;
