import "./Tabs.css";

type TabTitle = string;
type TabProps = {
  title: TabTitle
}

const Tab:React.FC<TabProps> = ({children}) =>{  
  return <div className="TabContent">{children}</div>

};

export default Tab;
