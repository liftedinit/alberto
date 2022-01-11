import { Link, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Button from "../components/Button";

function AddAccountView() {
  const navigate = useNavigate();
  return (
    <div className="Page">
      <Header>
        <Header.Right>
          <Link to="/accounts">Back</Link>
        </Header.Right>
      </Header>
      <Button label="Create New Account" onClick={() => navigate("new")} />
      <Button label="Import Seed Words" onClick={() => navigate("seed")} />
      <Button label="Import PEM File" onClick={() => navigate("pem")} />
    </div>
  );
}
export default AddAccountView;
