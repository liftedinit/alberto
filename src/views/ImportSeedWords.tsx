import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import omni from "omni";
import { StoreContext } from "../store";
import { Account } from "../store/accounts";

function ImportSeedWordsView() {
  const navigate = useNavigate();
  const { dispatch } = useContext(StoreContext);
  const [account, setAccount] = useState<Account>({ name: "" });

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setAccount({ ...account, name });
  };

  const handleMnemonic = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const mnemonic = event.target.value;
    try {
      const keys = omni.keys.fromSeedWords(mnemonic);
      setAccount({ ...account, keys });
    } catch (e) {
      setAccount({ ...account, keys: undefined });
    }
  };

  const handleSave = () => {
    dispatch({ type: "ACCOUNTS.CREATE", payload: account });
    navigate("/accounts");
  };

  return (
    <pre>
      [IMPORT SEED WORDS]
      <p>
        Name: <input name="name" onChange={handleName} />
      </p>
      <p>
        Seed Words: <textarea name="seedWords" onChange={handleMnemonic} />
      </p>
      <ul>
        <li>
          <Link to="/accounts/add">Back</Link>
        </li>
      </ul>
      <button disabled={!account.name || !account.keys} onClick={handleSave}>
        Save
      </button>
    </pre>
  );
}
export default ImportSeedWordsView;
