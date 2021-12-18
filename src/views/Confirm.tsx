import { Link } from "react-router-dom";

function ConfirmView() {
  return (
    <pre>
      [CONFIRM]
      <ul>
        <li>
          <Link to="/send">Back</Link>
        </li>
        <li>
          <Link to="/">Confirm</Link>
        </li>
      </ul>
    </pre>
  );
}
export default ConfirmView;
