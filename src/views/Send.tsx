import { Link } from "react-router-dom";

function SendView() {
  return (
    <pre>
      [SEND]
      <ul>
        <li>
          <Link to="/">Back</Link>
        </li>
        <li>
          <Link to="/confirm">Next</Link>
        </li>
      </ul>
    </pre>
  );
}
export default SendView;
