import React, { useState } from "react";

export function Tabs({ children }) {
  // Find the first tab from TabsTrigger or TabsContent children
  const getFirstTab = () => {
    let firstTab = null;
    React.Children.forEach(children, (child) => {
      if (
        child.type === TabsList ||
        child.type === TabsTrigger ||
        child.type === TabsContent
      ) {
        React.Children.forEach(child.props.children, (subChild) => {
          if (subChild.props && subChild.props.tab && !firstTab) {
            firstTab = subChild.props.tab;
          }
        });
      } else if (child.props && child.props.tab && !firstTab) {
        firstTab = child.props.tab;
      }
    });
    return firstTab;
  };

  const [active, setActive] = useState(getFirstTab());

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { active, setActive })
      )}
    </div>
  );
}

export function TabsList({ children, active, setActive }) {
  return <div className="flex gap-2 mb-4">{children}</div>;
}

export function TabsTrigger({ children, tab, active, setActive }) {
  const isActive = active === tab;
  return (
    <button
      className={`px-4 py-2 rounded ${
        isActive ? "bg-blue-600 text-white" : "bg-gray-200"
      }`}
      onClick={() => setActive(tab)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, tab, active }) {
  const isActive = active === tab;
  return isActive ? <div>{children}</div> : null;
}
