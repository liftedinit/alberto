import "./Button.css";

interface ButtonProps {
  disabled?: boolean;
  label: string;
  onClick: React.MouseEventHandler;
  active? :boolean;
}

function Button({ disabled = false, label, onClick }: ButtonProps) {      
  return (
    <button disabled={disabled} onClick={onClick} className="Button">
      {label}
    </button>
  );
}

function FooterButton({ disabled = false, label, onClick }: ButtonProps) {  
  return (
    <button disabled={disabled} onClick={onClick} className="Button">
      {label}
    </button>
  );
}

Button.Footer = FooterButton;

function TabButton({ disabled = false, label, onClick, active = false }: ButtonProps) {      
const getClassName = (active: boolean) => {    
  return active === true ? "Button Active" : "Button"
}
  return (
    <button disabled={disabled} onClick={onClick} className={getClassName(active)}>
      {label}
    </button>
  );
}
Button.TabButton = TabButton;

export default Button;
