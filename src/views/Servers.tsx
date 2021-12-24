import { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../store";

function ServersView() {
  const { state } = useContext(StoreContext);
  return (
    <pre>
      [SERVERS]
      <ul>
        <li>
          <Link to="/">Back</Link>
        </li>
      </ul>
      <ul>
        {state.servers.map((server, index) => (
          <li key={index}>{server.name}</li>
        ))}
      </ul>
      <ul>
        <li>
          <Link to="add">Add</Link>
        </li>
      </ul>
    </pre>
  );
}
export default ServersView;
