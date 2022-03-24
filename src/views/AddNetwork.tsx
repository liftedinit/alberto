import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Network } from "many-js";
import { StoreContext } from "../store";
import { NetworkParams } from "../store/networks";

import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import Page from "../components/Page";

function AddNetworkView() {
  const navigate = useNavigate();
  const { dispatch } = useContext(StoreContext);
  const [newNetwork, setNetwork] = useState<NetworkParams>({
    name: "",
    url: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNetwork({ ...newNetwork, [name]: value });
  };

  const handleSave = async () => {
    try {
      const network = new Network(newNetwork.url);
      await network.base.heartbeat();
      dispatch({ type: "NETWORKS.CREATE", payload: network });
      navigate("/networks");
    } catch (e) {}
  };

  return (
    <Page>
      <Header>
        <Header.Right>
          <Link to="/networks">Back</Link>
        </Header.Right>
      </Header>
      <Input label="Name" name="name" onChange={handleChange} />
      <Input label="URL" name="url" type="url" onChange={handleChange} />

      <Button.Footer
        disabled={!newNetwork.name || !newNetwork.url}
        label="Save"
        onClick={handleSave}
      />
    </Page>
  );
}
export default AddNetworkView;
