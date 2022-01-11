import React from "react";
import "./Input.css";

interface InputProps {
  label: string;
  name: string;
  onChange: React.ChangeEventHandler;
  type?: string;
}

function Input({ label, name, onChange, type = "text" }: InputProps) {
  return (
    <div className="Input">
      <label>{label}</label>
      {type === "textarea" ? (
        <textarea name={name} onChange={onChange} />
      ) : (
        <input name={name} type={type} onChange={onChange} />
      )}
    </div>
  );
}

export default Input;
