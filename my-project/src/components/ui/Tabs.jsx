import React, { useState } from "react";

export function Tabs({ children }) {
  const [active, setActive] = useState(null);

  return (
    <div>
      {React.Children.map(children, child =>
        React.cloneElement(child, { active, setActive })
      )}
    </div>
  );
}

export function TabsList({ children, active, setActive }) {
  return (
    <div className="flex gap-2 mb-4">
      {React.Children.map(children, child =>
        React.cloneElement(child, { active, setActive })
      )}
    </div>
  );
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

export function TabsContent({ children, tab, activeTab, active }) {
  const isActive = active === tab || activeTab === tab;
  return isActive ? <div>{children}</div> : null;
}
