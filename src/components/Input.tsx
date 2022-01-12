import React from "react";
import "./Input.css";

interface InputProps {
  label: string;
  name: string;
  onChange: React.ChangeEventHandler;
  type?: string;
  defaultValue?: any;
}

function Input({
  defaultValue,
  label,
  name,
  onChange,
  type = "text",
}: InputProps) {
  return (
    <div className="Input">
      <label>{label}</label>
      {type === "textarea" ? (
        <textarea name={name} onChange={onChange} defaultValue={defaultValue} />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          onChange={onChange}
        />
      )}
    </div>
  );
}

export default Input;
