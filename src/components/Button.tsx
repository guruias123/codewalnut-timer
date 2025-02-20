import React from "react";

interface ButtonProps {
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  disabled = false,
  children,
  variant = "primary",
}) => {
  const baseStyles =
    "px-4 py-2 text-sm font-medium rounded-md transition-colors";

  const variantStyles =
    variant === "primary"
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "text-gray-700 bg-gray-100 hover:bg-gray-200";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles}`}
    >
      {children}
    </button>
  );
};

export default Button;
