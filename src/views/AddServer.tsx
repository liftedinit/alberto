import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import omni from "omni";
import { StoreContext } from "../store";
import { Server } from "../store/servers";

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
    <pre>
      [ADD SERVER]
      <p>
        Name: <input name="name" onChange={handleChange} />
      </p>
      <p>
        URL: <input name="url" type="url" onChange={handleChange} />
      </p>
      <ul>
        <li>
          <Link to="/servers">Back</Link>
        </li>
      </ul>
      <button disabled={!server.name || !server.url} onClick={handleSave}>
        Save
      </button>
    </pre>
  );
}
export default AddServerView;
