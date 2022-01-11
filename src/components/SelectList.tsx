import React from "react";

import "./SelectList.css";

interface SelectListProps {
  children: React.ReactNode;
}

interface SelectListItemProps {
  children: React.ReactNode;
  selected: Boolean;
  onClick: React.MouseEventHandler;
}

function SelectListItem({ children, onClick, selected }: SelectListItemProps) {
  return (
    <div
      className={`SelectListItem ${selected ? " selected" : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function SelectList({ children }: SelectListProps) {
  return <div className="SelectList">{children}</div>;
}

SelectList.Item = SelectListItem;

export default SelectList;
