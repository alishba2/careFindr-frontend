// File: src/pages/dashboard/EquipmentMenu.jsx
import React from "react";

export default function EquipmentMenu() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Equipment & Test Menu</h2>
      <button className="mb-2 px-4 py-2 bg-green-500 text-white rounded">+ Add Equipment</button>
      <button className="mb-2 px-4 py-2 bg-blue-500 text-white rounded ml-4">+ Add Test</button>
      <ul className="list-disc pl-5 mt-4">
        <li>ECG Machine</li>
        <li>Blood Test - CBC</li>
      </ul>
    </div>
  );
}