import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../store";

import Header from "../components/Header";
import SelectList from "../components/SelectList";
import Button from "../components/Button";
import Page from "../components/Page";

function ServersView() {
  const { dispatch, state } = useContext(StoreContext);
  const handleClick = (id: number) => () =>
    dispatch({ type: "SERVERS.TOGGLE", payload: id });
  const navigate = useNavigate();
  return (
    <Page>
      <Header>
        <Header.Right>
          <Link to="/">Back</Link>
        </Header.Right>
      </Header>
      <SelectList>
        {Array.from(state.servers.byId, ([id, server]) => (
          <SelectList.Item
            key={id}
            selected={state.servers.activeIds.has(id)}
            onClick={handleClick(id)}
          >
            <h3>{server.name}</h3>
            <h4>{server.url}</h4>
          </SelectList.Item>
        ))}
      </SelectList>
      <Button label="Add a Server" onClick={() => navigate("add")} />
    </Page>
  );
}
export default ServersView;
