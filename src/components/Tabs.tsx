import React, { Children } from "react";

import "./Tabs.css";

interface TabsProps {
  children?: React.ReactNode;
  tab: number;
}

function Tabs({ tab = 0, children }: TabsProps) {
  return (
    <div className="Tabs">
      {Children.map(children, (child, index) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              isActive: tab === index,
            })
          : ""
      )}
    </div>
  );
}

interface TabProps {
  children?: React.ReactNode;
  isActive?: boolean;
}

function Tab({ children, isActive }: TabProps) {
  return <div className={`Tab ${isActive ? " active" : ""}`}>{children}</div>;
}

Tabs.Tab = Tab;

export default Tabs;