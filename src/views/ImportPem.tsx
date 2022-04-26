import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { KeyPair } from "many-js";
import { StoreContext } from "../store";
import { Account } from "../store/accounts";

import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";
import Page from "../components/Page";

function ImportPemView() {
  const navigate = useNavigate();
  const { dispatch } = useContext(StoreContext);
  const [account, setAccount] = useState<Account>({ name: "" });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAccount({ ...account, [name]: value });
  };

  const handlePem = (event: React.ChangeEvent<HTMLTextAreaElement>) => {}

  const handleSave = () => {
    dispatch({ type: "ACCOUNTS.CREATE", payload: account });
    navigate("/accounts");
  };

  return (
    <Page>
      <Header>
        <Header.Right>
          <Link to="/accounts/add">Back</Link>
        </Header.Right>
      </Header>
      <Input name="name" label="Name" onChange={handleChange} />
      <Input name="pem" label="PEM File" onChange={handlePem} type="textarea" />

      <Button.Footer
        disabled={!account.name || !account.keys}
        onClick={handleSave}
        label="Save"
      />
    </Page>
  );
}
export default ImportPemView;
