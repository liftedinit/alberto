import React, { useContext, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { StoreContext } from "../store";
// import { Receiver } from "../store/receivers";
// import { Identity } from "many-js";

// import Header from "../components/Header";
// import Page from "../components/Page";
// import Button from "../components/Button";
// import Input from "../components/Input";

// const AddReceiverView = () => {
//   const navigate = useNavigate();
//   const { dispatch } = useContext(StoreContext);
//   const [name, setName] = useState<string>("");
//   const [address, setAddress] = useState<string>("");

//   const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const name = event.target.value;
//     setName(name);
//   };

//   const handleAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const address = event.target.value;
//     setAddress(address);
//   };

//   const handleAdd = () => {
//     if (name === "" || address === "") {
//       alert("Please input name and address");
//       return;
//     }
//     const identity = Identity.fromString(address);
//     const newReceiver: Receiver = { name, identity };
//     dispatch({ type: "RECEIVER.CREATE", payload: newReceiver });
//     navigate("/send");
//   };

//   return (
//     <Page>
//       <Header>
//         <Header.Right>
//           <Link to="/send">Back</Link>
//         </Header.Right>
//       </Header>
//       <Input name="Name" onChange={handleName} label="Name" />
//       <Input name="Address" onChange={handleAddress} label="Address" />
//       <Button.Footer label="Add" onClick={handleAdd} />
//     </Page>
//   );
// };

// export default AddReceiverView;
