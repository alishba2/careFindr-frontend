import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import AllFacilities from "./AllFacilities";
import FacilityDetail from "./facility-detail";

const AdminDashboard = () => {
  return (
    <div className="admin-layout">
      {/* Add your sidebar/navbar if needed */}
      
      <div className="p-4">
        <Routes>
          <Route index element={<AllFacilities />} />
          <Route path="facilities" element={<AllFacilities />} />
          <Route path="facilities/:id" element={<FacilityDetail />} />
        </Routes>

        {/* OR with <Outlet /> if you prefer layout nesting */}
        {/* <Outlet /> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
