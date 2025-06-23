// File: src/pages/dashboard/Feedback.jsx
import React from "react";

export default function Feedback() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Feedback & Inquiries</h2>
      <div className="bg-white p-4 border rounded shadow-sm">
        <p><strong>From:</strong> user@example.com</p>
        <p><strong>Message:</strong> Is ECG test available?</p>
        <div className="mt-2 space-x-2">
          <button className="bg-primary text-white px-3 py-1 rounded">Reply</button>
          <button className="bg-gray-300 text-black px-3 py-1 rounded">Mark as Resolved</button>
        </div>
      </div>
    </div>
  );
}
