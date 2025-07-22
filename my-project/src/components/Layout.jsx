import React from "react";


const Layout = ({ children }) => {
  return (
    <div className="relative">
      <Navbar />
      <div className="pt-28">{children}</div>
    </div>
  );
};

export default Layout;
