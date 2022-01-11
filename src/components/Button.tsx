import "./Button.css";

interface ButtonProps {
  label: string;
  onClick: React.MouseEventHandler;
}

function Button({ label, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className="Button">
      {label}
    </button>
  );
}

export default Button;
