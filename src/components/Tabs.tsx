import {ReactElement, useState} from "react";
import TabTitle from "./TabTitle";
import "./Tabs.css";
type Props = {
  children: ReactElement[]
}

const Tabs: React.FC<Props> = ({children}) => {  
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="TabsContainer">     
      {children[selectedTab]}      
      <div className="TabTitle">
        {children.map((item, index) => (
          <TabTitle
            key={index}
            title={item.props.title}
            index={index}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))} 
      </div>              
    </div>
  )
}

export default Tabs;