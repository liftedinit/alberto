import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../store";

import Header from "../components/Header";
import SelectList from "../components/SelectList";
import Button from "../components/Button";
import Page from "../components/Page";

function NetworksView() {
  const { dispatch, state } = useContext(StoreContext);
  const handleClick = (id: number) => () =>
    dispatch({ type: "NETWORKS.SELECT", payload: id });
  const navigate = useNavigate();
  return (
    <Page>
      <Header>
        <Header.Right>
          <Link to="/">Back</Link>
        </Header.Right>
      </Header>
      <SelectList>
        {Array.from(state.networks.byId, ([id, network]) => (
          <SelectList.Item
            key={id}
            selected={state.networks.activeId === id}
            onClick={handleClick(id)}
          >
            <h3>{network.name}</h3>
            <h4>{network.url}</h4>
          </SelectList.Item>
        ))}
      </SelectList>
      <Button label="Add a Network" onClick={() => navigate("add")} />
    </Page>
  );
}
export default NetworksView;
