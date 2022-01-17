import "./Button.css";

interface ButtonProps {
  disabled?: boolean;
  label: string;
  onClick: React.MouseEventHandler;
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
    <button disabled={disabled} onClick={onClick} className="Button Footer">
      {label}
    </button>
  );
}

Button.Footer = FooterButton;

export default Button;