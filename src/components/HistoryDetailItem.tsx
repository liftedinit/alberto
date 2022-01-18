import "./DetailItem.css";
import { TransactionDetails } from "../store/transactions";
import { getAddressFromHex } from "../helper/common";
import { fromDateTime } from "../helper/convert";

interface HistoryItemProps {    
  transaction: TransactionDetails
}

const HistoryDetailItem:React.FC<HistoryItemProps> = ({transaction}) =>{     
  return (        
    <div className="DetailItem">
      <div className="Address">        
        <span className="Identity"><b>From:</b> {`<${getAddressFromHex(transaction.from)}>`}</span>
        <span className="Identity"><b>To:</b> {`<${getAddressFromHex(transaction.to)}>`}</span>
      </div>
      <div className="Amount">
        <span className="From">+{transaction.amount.toString()}</span>
        <span className="Symbol">{transaction.symbol}</span>
      </div>
      <div className="Time">
        {fromDateTime(transaction.timestamp)}
      </div>
    </div>    
  )
};
 
export default HistoryDetailItem;