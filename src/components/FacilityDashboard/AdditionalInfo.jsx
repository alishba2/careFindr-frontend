// ===== 8. hospitalServices/components/AdditionalInfo.jsx =====
import React from 'react';
import TextArea from "antd/es/input/TextArea";

export const AdditionalInfo = ({ capabilities, setCapabilities }) => (
    <div className="space-y-2">
        <label className="text-sm font-bold text-gray-800">Additional Information</label>
        <TextArea
            rows={4}
            className="border-gray-300 rounded-md"
            value={capabilities.additionalInformation}
            onChange={(e) =>
                setCapabilities((prev) => ({
                    ...prev,
                    additionalInformation: e.target.value,
                }))
            }
            placeholder="Enter any additional information"
        />
    </div>
);