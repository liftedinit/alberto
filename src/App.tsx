import React from "react";
import omni from "omni";
import "./App.css";

interface StatusResponse {
  attributes: number[];
}
type InfoResponse = any[];

const call =
  (serverUrl: string, method: string, callback: (response: any) => void) =>
  async () => {
    const response = await omni.server.send(serverUrl, { method });
    callback(response);
  };

function App() {
  const [serverUrl, setServerUrl] = React.useState<string>("");
  const [status, setStatus] = React.useState<StatusResponse | null>(null);
  const [info, setInfo] = React.useState<InfoResponse | null>(null);
  React.useEffect(() => {
    const fetchStatus = call(serverUrl, "status", setStatus);
    fetchStatus();
    const fetchinfo = call(serverUrl, "ledger.info", setInfo);
    fetchinfo();
  }, [serverUrl]);
  return (
    <div className="App">
      <input
        onChange={(event) => {
          setServerUrl(event.currentTarget.value);
        }}
        defaultValue="http://localhost:8000/"
      />
      <h3>Attributes</h3>
      {status ? (
        <table>
          <tbody>
            <tr>
              <td>Base</td>
              <td>{`${status.attributes.includes(0) ? "🟢" : ""}`}</td>
            </tr>
            <tr>
              <td>Blockchain</td>
              <td>{`${status.attributes.includes(1) ? "🟢" : ""}`}</td>
            </tr>
            <tr>
              <td>Ledger</td>
              <td>{`${status.attributes.includes(2) ? "🟢" : ""}`}</td>
            </tr>
            <tr>
              <td>ABCI-OMNI Bridge</td>
              <td>{`${status.attributes.includes(1000) ? "🟢" : ""}`}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        "Loading"
      )}
      <h3>Symbols</h3>
      {info ? (
        <ul>
          {info[0].map((item: string) => (
            <li>{item}</li>
          ))}
        </ul>
      ) : (
        "Loading"
      )}
    </div>
  );
}

export default App;
