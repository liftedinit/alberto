import React from "react";

import "./Select.css";

interface Option {
  label: string;
  value: any;
}

interface SelectProps {
  options?: Option[];
  onChange?: React.ChangeEventHandler;
  name: string;
  label: string;
  defaultValue?: any;
}

function Select({
  defaultValue,
  name,
  label,
  onChange,
  options = [],
}: SelectProps) {
  return (
    <div className="Select">
      <label>{label}</label>
      <select name={name} onChange={onChange} defaultValue={defaultValue}>
        <option></option>
        {options.map(({ label, value }, index) => (
          <option key={index} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
