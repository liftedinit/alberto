import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import omni from "omni";
import { StoreContext } from "../store";
import { Server } from "../store/servers";

import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import Page from "../components/Page";

function AddServerView() {
  const navigate = useNavigate();
  const { dispatch } = useContext(StoreContext);
  const [server, setServer] = useState<Server>({ name: "", url: "" });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setServer({ ...server, [name]: value });
  };

  const handleSave = async () => {
    try {
      await omni.server.send(server.url, { method: "heartbeat" });
      dispatch({ type: "SERVERS.CREATE", payload: server });
      navigate("/servers");
    } catch (e) {}
  };

  return (
    <Page>
      <Header>
        <Header.Right>
          <Link to="/servers">Back</Link>
        </Header.Right>
      </Header>
      <Input label="Name" name="name" onChange={handleChange} />
      <Input label="URL" name="url" type="url" onChange={handleChange} />

      <Button.Footer
        disabled={!server.name || !server.url}
        label="Save"
        onClick={handleSave}
      />
    </Page>
  );
}
export default AddServerView;
