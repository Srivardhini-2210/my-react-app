import React from "react";

export function Button({ children, onClick, variant = "primary" }) {
  const base = "px-4 py-2 rounded font-medium focus:outline-none transition";
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
}
