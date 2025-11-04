import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = ({ children, role }) => {
  return (
    <div className="d-flex vh-100 bg-dark">
      {/* Sidebar fixa */}
      <div style={{ flex: "0 0 250px" }}>
        <Sidebar role={role} />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header */}
        <Header role={role} />

        {/* Área principal */}
        <main className="flex-grow-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
