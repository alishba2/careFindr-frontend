// File: src/pages/dashboard/Sidebar.jsx
import React from "react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "home", label: "Dashboard Home" },
    { key: "services", label: "Edit Services" },
    { key: "equipment", label: "Equipment & Tests" },
    { key: "appointments", label: "Appointments" },
    { key: "referrals", label: "Referrals" },
    { key: "feedback", label: "Feedback/Inquiries" },
  ];

  return (
    <aside className="w-64 bg-white border-r p-5 space-y-4">
      <h1 className="text-2xl font-bold text-primary">Facility</h1>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-100 ${activeTab === tab.key ? 'bg-gray-200 font-semibold' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </aside>
  );
}
