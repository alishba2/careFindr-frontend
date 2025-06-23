// File: src/pages/dashboard/Referrals.jsx
import React, { useState } from "react";

export default function Referrals() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Referrals</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Age</th>
            <th className="p-2">Sex</th>
            <th className="p-2">Purpose</th>
            <th className="p-2">Confirmed</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td className="p-2">Jane Smith</td>
            <td className="p-2">30</td>
            <td className="p-2">F</td>
            <td className="p-2">Emergency</td>
            <td className="p-2">
              <button
                onClick={() => setConfirmed(true)}
                className={`px-3 py-1 rounded ${confirmed ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}
              >
                {confirmed ? "Confirmed" : "Confirm Arrival"}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
