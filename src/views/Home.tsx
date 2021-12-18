import { Link } from "react-router-dom";

function HomeView() {
  return (
    <pre>
      [HOME]
      <ul>
        <li>
          <Link to="/accounts">Accounts</Link>
        </li>
        <li>
          <Link to="/servers">Servers</Link>
        </li>
        <li>
          <Link to="/send">Send</Link>
        </li>
      </ul>
    </pre>
  );
}
export default HomeView;
