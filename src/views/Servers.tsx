import { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../store";

function ServersView() {
  const { dispatch, state } = useContext(StoreContext);
  return (
    <pre>
      [SERVERS]
      <ul>
        <li>
          <Link to="/">Back</Link>
        </li>
      </ul>
      <ul>
        {Array.from(state.servers.byId, ([id, server]) => (
          <li key={id}>
            {state.servers.activeIds.has(id) ? "✓ " : "  "}
            <span
              onClick={() => dispatch({ type: "SERVERS.TOGGLE", payload: id })}
            >
              {server.name}
            </span>
          </li>
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
