import { useState, useEffect, useCallback } from "react";
import Button from "../components/Button";

import "./Tabs.css";
 
type TabProps = {
  title: string
  index: number,
  selectedTab: number,
  setSelectedTab: (index: number) => void,  
}

const TabTitle: React.FC<TabProps> = ({title, setSelectedTab, index, selectedTab}) => {
  const onClick = useCallback(() => {        
    setSelectedTab(index);
  }, [setSelectedTab, index]); 

  return (       
      <Button.TabButton onClick={onClick} label={title} active={index === selectedTab} />    
    )
};
export default TabTitle;