import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { StoreContext } from "../store";
import { Server } from "../store/servers";
import { Account } from "../store/accounts";

import Header from "../components/Header";
import Page from "../components/Page";
import Tabs from "../components/Tabs";
import Tab from "../components/Tab";
import Button from "../components/Button";

import DetailHeader from "../components/DetailHeader";
import HistoryDetailItem from "../components/HistoryDetailItem";


const AccountDetailView = () => {
  const navigate = useNavigate();
  const { state } = useContext(StoreContext);
  
  const [name, setName] = useState<string>('');
  const [server, setServer] = useState<string>('');

  useEffect(() => {
    const account: Account = state.accounts.byId.get(
      state.accounts.nextId - 1
    ) || { name: "" };
    setName(account.name);

    const server: Server = state.servers.byId.get(state.servers.nextId - 1) || { name: "", url: "" };
    setServer(server.url);

  }, [state.accounts.byId, state.servers.byId])
  
  const handleNewTransaction = () => {
    navigate("/send");
  }
  return (
    <Page>
      <Header>
        <Header.Left>{name} - {server}</Header.Left>
        <Header.Right>
          <Link to="/">Back</Link>
        </Header.Right>
      </Header>
      <Tabs>
        <Tab title="Symbols">
          <DetailHeader type='symbols' />
        </Tab>
        <Tab title="History">
          <DetailHeader type='history' />        
          <div className="HistoryContent">
            {Array.from(state.transactions.byTransactionId, ([id, transaction]) => (
              <HistoryDetailItem 
                id={id} 
                transaction={transaction}              
              />            
            ))} 
            <Button onClick={handleNewTransaction} label="New Transaction" />                     
          </div>          
        </Tab>
      </Tabs>      
    </Page>
  )
}
export default AccountDetailView;