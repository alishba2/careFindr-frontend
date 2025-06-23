// File: src/pages/dashboard/Appointments.jsx
import React from "react";

export default function Appointments() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Appointments</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Date</th>
            <th className="p-2">Time</th>
            <th className="p-2">Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td className="p-2">John Doe</td>
            <td className="p-2">2025-06-23</td>
            <td className="p-2">10:30 AM</td>
            <td className="p-2">General Checkup</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
