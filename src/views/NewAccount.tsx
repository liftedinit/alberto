import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { KeyPair } from "many";
import { StoreContext } from "../store";
import { Account } from "../store/accounts";

import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";
import Page from "../components/Page";

function NewAccountView() {
  const navigate = useNavigate();
  const { dispatch } = useContext(StoreContext);
  const [account, setAccount] = useState<Account>({ name: "" });
  const [seedWords, setSeedWords] = useState("");

  useEffect(() => {
    const mnemonic = KeyPair.getMnemonic();
    const keys = KeyPair.fromMnemonic(mnemonic);
    setSeedWords(mnemonic);
    setAccount((account) => ({ ...account, keys }));
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAccount({ ...account, [name]: value });
  };

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
      <label>Seed Words</label>
      <p style={{ fontSize: "2rem", fontWeight: 300 }}>{seedWords}</p>

      <Button.Footer
        disabled={!account.name}
        label="Save"
        onClick={handleSave}
      />
    </Page>
  );
}
export default NewAccountView;
