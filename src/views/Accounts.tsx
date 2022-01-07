import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../store";
 
import { parseIdentity } from "../helper/common";

function AccountsView() {
  const { dispatch, state } = useContext(StoreContext);
  return (
    <pre>
      [ACCOUNTS]
      <ul>
        <li>
          <Link to="/">Back</Link>
        </li>
      </ul>
      <ul>
        {Array.from(state.accounts.byId, ([id, account]) => (
          <li key={id}>
            {state.accounts.activeIds.has(id) ? "✓ " : "  "}
            <span
              onClick={() => dispatch({ type: "ACCOUNTS.TOGGLE", payload: id })}
            >
              {account.name} 
              {' '} { parseIdentity(account.identity) }
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
export default AccountsView;
