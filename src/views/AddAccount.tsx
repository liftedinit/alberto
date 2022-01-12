import { Link, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Button from "../components/Button";
import Page from "../components/Page";

function AddAccountView() {
  const navigate = useNavigate();
  return (
    <Page>
      <Header>
        <Header.Right>
          <Link to="/accounts">Back</Link>
        </Header.Right>
      </Header>
      <Button label="Create New Account" onClick={() => navigate("new")} />
      <Button label="Import Seed Words" onClick={() => navigate("seed")} />
      <Button label="Import PEM File" onClick={() => navigate("pem")} />
    </Page>
  );
}
export default AddAccountView;
