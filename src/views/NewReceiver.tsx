import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import omni from "omni";
import { StoreContext } from "../store";
import { Receiver } from "../store/receivers";
import { Identity } from "omni/dist/identity";

const NewReceiverView = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(StoreContext);
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setName(name);
  }

  const handleAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const address = event.target.value;    
    setAddress(address);
  }

  const handleAdd = () => {
    if (name === "" || address === "") {
      alert("Please input name and address");
      return;
    }
    const identity: Identity = omni.identity.fromString(address);
    const newReceiver: Receiver = { name, identity };
    dispatch({ type: "RECEIVER.CREATE", payload: newReceiver} );
    navigate("/send");
  }

  return (
    <pre>
       <Link to="/send">Back</Link>
      <p>
        <label>Name: </label>
        <input type="text" onChange={handleName} maxLength={128}/>
      </p>
      <p>
        <label>Address: </label>
        <input type="text" onChange={handleAddress} maxLength={512} />
      </p>
      <p style={{textAlign: "center"}}>
        <button type="button" onClick={handleAdd}>Add</button>
      </p>
    </pre>
  );
}

export default NewReceiverView;