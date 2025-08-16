import React from "react";

export function Card({ children }) {
  return <div className="border rounded-lg shadow-sm bg-white">{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="p-4 border-b">{children}</div>;
}

export function CardTitle({ children }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}
export function CardFooter({ children, className, ...props }) {
  return (
    <div className={`p-4 border-t ${className || ""}`} {...props}>
      {children}
    </div>
  );
}
