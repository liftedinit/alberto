import { Link } from "react-router-dom";

function AddAccountView() {
  return (
    <pre>
      [ADD ACCOUNT]
      <ul>
        <li>
          <Link to="/accounts">Back</Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link to="new">Create New Account</Link>
        </li>
        <li>
          <Link to="seed">Import from Seed Words</Link>
        </li>
        <li>
          <Link to="pem">Import from PEM File</Link>
        </li>
      </ul>
    </pre>
  );
}
export default AddAccountView;
