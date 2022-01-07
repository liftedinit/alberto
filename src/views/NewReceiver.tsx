import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NewReceiverView = () => {
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