import React, { useContext } from "react"
import { StoreContext } from "../store"
import omni from "omni";
import "./DetailItem.css";
import { TransactionDetails } from "../store/transactions";
import { getAddressFromHex } from "../helper/common";
import { fromDateTime } from "../helper/convert";

interface HistoryItemProps {    
  transaction: TransactionDetails
}

const HistoryDetailItem:React.FC<HistoryItemProps> = ({transaction}) =>{ 
  const { state } = useContext(StoreContext)
  const symbols = state.balances.symbols
  
  const symbol: any = Array.from(symbols).map(([key, value]) => {    
    const symbolIdentity: string = omni.identity.toString(transaction.symbol)          
    return key === symbolIdentity ? value : 'FBT'
  })   
  return (        
    <div className="DetailItem">
      <div className="Address">        
        <span className="Identity"><b>From:</b> {`<${getAddressFromHex(transaction.from)}>`}</span>
        <span className="Identity"><b>To:</b> {`<${getAddressFromHex(transaction.to)}>`}</span>
      </div>
      <div className="Amount">
        {transaction.uid}
        <span className="From">+{transaction.amount.toString()}</span>
        <span className="Symbol">{symbol}</span>
      </div>
      <div className="Time">
        {fromDateTime(transaction.timestamp)}
      </div>
    </div>    
  )
};
 
export default HistoryDetailItem;