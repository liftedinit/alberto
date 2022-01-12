import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../store";

import { displayId } from "../helper/common";

import Page from "../components/Page";
import Header from "../components/Header";
import Button from "../components/Button";
import SelectList from "../components/SelectList";

function AccountsView() {
  const { dispatch, state } = useContext(StoreContext);
  const handleClick = (id: number) => () =>
    dispatch({ type: "ACCOUNTS.TOGGLE", payload: id });
  const navigate = useNavigate();
  return (
    <Page>
      <Header>
        <Header.Right>
          <Link to="/">Back</Link>
        </Header.Right>
      </Header>
      <SelectList>
        {Array.from(state.accounts.byId, ([id, account]) => (
          <SelectList.Item
            key={id}
            selected={state.accounts.activeId === id}
            onClick={handleClick(id)}
          >
            <h3>{account.name}</h3>
            <h4>{displayId(account)}</h4>
          </SelectList.Item>
        ))}
      </SelectList>
      <Button label="Add an Account" onClick={() => navigate("add")} />
    </Page>
  );
}
export default AccountsView;
