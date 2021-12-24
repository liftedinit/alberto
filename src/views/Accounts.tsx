import { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../store";

function AccountsView() {
  const { state } = useContext(StoreContext);
  return (
    <pre>
      [ACCOUNTS]
      <ul>
        <li>
          <Link to="/">Back</Link>
        </li>
      </ul>
      <ul>
        {state.accounts.map((account, index) => (
          <li key={index}>{account.name}</li>
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
