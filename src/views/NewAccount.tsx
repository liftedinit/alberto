import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import omni from "omni";
import { StoreContext } from "../store";
import { Account } from "../store/accounts";

function NewAccountView() {
  const navigate = useNavigate();
  const { dispatch } = useContext(StoreContext);
  const [account, setAccount] = useState<Account>({ name: "" });
  const [seedWords, setSeedWords] = useState("");

  useEffect(() => {
    const mnemonic = omni.keys.getSeedWords();
    const keys = omni.keys.fromSeedWords(mnemonic);
    setSeedWords(mnemonic);
    setAccount((account) => ({ ...account, keys }));
  }, []);

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setAccount({ ...account, name });
  };

  const handleSave = () => {
    dispatch({ type: "ACCOUNTS.CREATE", payload: account });
    navigate("/accounts");
  };

  return (
    <pre>
      [NEW ACCOUNT]
      <p>
        Name: <input name="name" onChange={handleName} />
      </p>
      <p>{seedWords}</p>
      <ul>
        <li>
          <Link to="/accounts/add">Back</Link>
        </li>
      </ul>
      <button disabled={!account.name} onClick={handleSave}>
        Save
      </button>
    </pre>
  );
}
export default NewAccountView;
