import "./DetailHeader.css";

type Props = {
  type: string
}

const DetailHeader: React.FC<Props> = ({type}) => {
  return (
    <div className="DetailHeader">      
      { type === 'symbols' && 
        <div className="SymbolHeader">
          <span>symbol</span>
          <span>balance</span>
        </div> 
      }      
      { type === 'history' && 
        <div className="HistoryHeader">
          <span className="Address">address</span>
          <span className="Amount">amount</span>
          <span className="Time">time</span>
        </div> 
      }      
    </div>    
  )
}

export default DetailHeader;