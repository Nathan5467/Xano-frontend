import React from "react";
import AdminFund from "./AdminFund";
import NewIpo from "./NewIpo";
import DashboardGraph from "./DashboardGraph";

const Admin_dashboard = () => {
  return (
    <div className="row" style={{ height: "600px" }}>
      <div className="col-4">
        <div className="ms-2">
          <AdminFund />
        </div>
        <div className="ms-4">
          <NewIpo />
        </div>
      </div>
      <div className="col-8">
        <DashboardGraph />
      </div>
    </div>
  );
};

export default Admin_dashboard;
