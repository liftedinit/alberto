import "./DetailItem.css";
import { getAddressFromHex } from "../helper/common";

import { TransactionDetails } from "../store/transactions";
interface HistoryItemProps {
  id: number,
  transaction: TransactionDetails
}

const HistoryDetailItem:React.FC<HistoryItemProps> = ({id, transaction}) =>{  
 
  return (
    <div className="DetailItem" key={`transaction-${id}`}>
      <div className="Address">        
        <span className="Identity"><b>From:</b> {`<${getAddressFromHex(transaction.from)}>`}</span>
        <span className="Identity"><b>To:</b> {`<${getAddressFromHex(transaction.to)}>`}</span>
      </div>
      <div className="Amount">
        <span className="From">+{transaction.amount.toString()}</span>
        <span className="Symbol">{transaction.symbol}</span>
      </div>
      <div className="Time">
        6 min ago
      </div>
    </div>
  )

};
 
export default HistoryDetailItem;