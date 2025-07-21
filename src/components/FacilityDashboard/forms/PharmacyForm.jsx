
// ===== 11. hospitalServices/forms/PharmacyForm.jsx =====
import React, { useEffect } from 'react';
import { Select } from 'antd';
import { OperatingHours } from '../operatingHours';
import { BranchAddresses } from '../BranchAddresses';
import { AdditionalInfo } from '../AdditionalInfo';

const { Option } = Select;

const PharmacyForm = ({ capabilities, setCapabilities, timeError, validateOperatingHours }) => {


    useEffect(()=>{

        console.log(capabilities, "capabilities");

    },[capabilities])
    const handleToggleCompliance = (value) => {
        setCapabilities((prev) => {
            const updated = prev.complianceDocuments.includes(value)
                ? prev.complianceDocuments.filter((item) => item !== value)
                : [...prev.complianceDocuments, value];
            return { ...prev, complianceDocuments: updated };
        });
    };

    const handleTogglePayment = (value) => {
        setCapabilities((prev) => {
            const updated = prev.acceptedPayments.includes(value)
                ? prev.acceptedPayments.filter((item) => item !== value)
                : [...prev.acceptedPayments, value];
            return { ...prev, acceptedPayments: updated };
        });
    };

    return (
        <>
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Do you have a licensed pharmacist on-site?
                </label>
                <Select
                    className="h-12 w-full"
                    value={capabilities.hasLicensedPharmacist}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            hasLicensedPharmacist: value,
                        }))
                    }
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">Do you offer delivery?</label>
                <Select
                    className="h-12 w-full"
                    value={capabilities.offersDelivery}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            offersDelivery: value,
                        }))
                    }
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>

            <div className="space-y-2">
                <h1 className="text-sm font-bold text-gray-900 mb-2">Compliance Documents</h1>
                <div className="flex flex-wrap gap-4">
                    {["PCN License", "NAFDAC Cert.", "CAC"].map((doc) => (
                        <label key={doc} className="text-sm text-gray-700 flex items-center gap-2">
                            <input
                                type="checkbox"
                                value={doc}
                                checked={capabilities.complianceDocuments.includes(doc)}
                                onChange={() => handleToggleCompliance(doc)}
                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                            />
                            {doc}
                        </label>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <h1 className="text-sm font-bold text-gray-900 mb-2">Accepted Payments</h1>
                <div className="flex flex-wrap gap-4">
                    {["NHIS", "HMO Insurance card", "Discounts/Bulk Pricing"].map((payment) => (
                        <label key={payment} className="text-sm text-gray-700 flex items-center gap-2">
                            <input
                                type="checkbox"
                                value={payment}
                                checked={capabilities.acceptedPayments.includes(payment)}
                                onChange={() => handleTogglePayment(payment)}
                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                            />
                            {payment}
                        </label>
                    ))}
                </div>
            </div>

            <OperatingHours 
                capabilities={capabilities} 
                setCapabilities={setCapabilities} 
                timeError={timeError}
                validateOperatingHours={validateOperatingHours}
            />

            <BranchAddresses capabilities={capabilities} setCapabilities={setCapabilities} />
            <AdditionalInfo capabilities={capabilities} setCapabilities={setCapabilities} />
        </>
    );
};

export default PharmacyForm;