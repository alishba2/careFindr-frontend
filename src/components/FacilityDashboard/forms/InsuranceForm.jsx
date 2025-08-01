import React, { useEffect } from 'react';
import { Input } from '../../input';
import { Button } from '../../button';
import { Select, Checkbox, Spin } from 'antd';
import TextArea from "antd/es/input/TextArea";
import { BranchAddresses } from '../BranchAddresses';
import { AdditionalInfo } from '../AdditionalInfo';
import { OperatingHours } from '../operatingHours';

const { Option } = Select;

const InsuranceForm = ({ capabilities, setCapabilities, timeError, validateOperatingHours, loading }) => {
    const addAccreditedHospital = () => {
        setCapabilities((prev) => ({
            ...prev,
            accreditedHospitals: [...prev.accreditedHospitals, { address: "" }],
        }));
    };

    const updateAccreditedHospital = (index, value) => {
        setCapabilities((prev) => {
            const updatedHospitals = [...prev.accreditedHospitals];
            updatedHospitals[index] = { address: value };
            return { ...prev, accreditedHospitals: updatedHospitals };
        });
    };

    const deleteAccreditedHospital = (index) => {
        setCapabilities((prev) => {
            const updatedHospitals = prev.accreditedHospitals.filter((_, i) => i !== index);
            return { ...prev, accreditedHospitals: updatedHospitals };
        });
    };

    const addWaitingPeriod = () => {
        setCapabilities((prev) => ({
            ...prev,
            waitingPeriods: [...prev.waitingPeriods, { service: "", duration: "", unit: "months" }],
        }));
    };

    const updateWaitingPeriod = (index, field, value) => {
        setCapabilities((prev) => {
            const updatedPeriods = [...prev.waitingPeriods];
            updatedPeriods[index] = { ...updatedPeriods[index], [field]: value };
            return { ...prev, waitingPeriods: updatedPeriods };
        });
    };

    const deleteWaitingPeriod = (index) => {
        setCapabilities((prev) => {
            const updatedPeriods = prev.waitingPeriods.filter((_, i) => i !== index);
            return { ...prev, waitingPeriods: updatedPeriods };
        });
    };

    useEffect(() => {
        console.log(capabilities, "capabilities are here");
    }, [capabilities]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-10">
                <Spin tip="Loading..." size="large" />
            </div>
        );
    }
    return (
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-0 mt-14 md:mt-0">
            {/* Coverage Details */}
            <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900">Coverage Details</label>

                {/* What's Covered */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">What's Covered</label>
                    <TextArea
                        rows={4}
                        type="text"
                        className="border-gray-300 rounded-md"
                        value={capabilities.coveredServices}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                coveredServices: e.target.value,
                            }))
                        }
                        placeholder="Enter covered services (e.g., Consultation, Surgery)"
                    />
                </div>

                {/* What's Not Covered */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">What's Not Covered (Exclusions)</label>
                    <TextArea
                        rows={4}
                        type="text"
                        className="border-gray-300 rounded-md"
                        value={capabilities.exclusions}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                exclusions: e.target.value,
                            }))
                        }
                        placeholder="Enter exclusions (e.g., Cosmetic procedures)"
                    />
                </div>

                {/* Pre-existing Conditions */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">Are Pre-existing Conditions Covered?</label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.preExistingConditions}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                preExistingConditions: value,
                            }))
                        }
                    >
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>

                {/* Emergency Coverage */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        What is the coverage for emergency services and ambulance transport?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.emergencyCoverage}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                emergencyCoverage: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes, Fully Covered</Option>
                        <Option value="Partial">Partially Covered</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>

                {/* Emergency Coverage Limitations - UPDATED FIELD NAME */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        Are there any limitations or conditions for emergency care coverage?
                    </label>
                    <TextArea
                        rows={3}
                        className="border-gray-300 rounded-md"
                        value={capabilities.limitationForCareCoverage}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                limitationForCareCoverage: e.target.value,
                            }))
                        }
                        placeholder="e.g., Pre-approval required for non-life threatening emergencies"
                    />
                </div>
            </div>

            {/* Claim Process - UPDATED FIELD NAMES */}
            <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900">Claim Process</label>

                {/* Claims Processing Procedure - UPDATED FIELD NAME */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">What is your claims processing procedure?</label>
                    <TextArea
                        rows={4}
                        className="border-gray-300 rounded-md"
                        value={capabilities.claimProcessSteps}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                claimProcessSteps: e.target.value,
                            }))
                        }
                        placeholder="Describe your step-by-step claims processing procedure"
                    />
                </div>

                {/* Claims Settlement Time - UPDATED FIELD NAME */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">How long does it take to settle provider claims?</label>
                    <Input
                        type="text"
                        className="h-12 border-gray-300 rounded-md"
                        value={capabilities.daysToSettleClaims}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                daysToSettleClaims: e.target.value,
                            }))
                        }
                        placeholder="e.g., 7-14 business days"
                    />
                </div>

                {/* Co-payments or Deductibles - REMOVED FROM HERE */}

                {/* Rejected Claims Handling - UPDATED FIELD NAME */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">How do you handle rejected or disputed claims?</label>
                    <TextArea
                        rows={3}
                        className="border-gray-300 rounded-md"
                        value={capabilities.handleRejectedClaims}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                handleRejectedClaims: e.target.value,
                            }))
                        }
                        placeholder="Describe your process for handling rejected or disputed claims"
                    />
                </div>

                {/* Payment System Type - UPDATED FIELD NAME */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">Is your payment system automated or manual?</label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.paymentSystem}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                paymentSystem: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Automated">Automated</Option>
                        <Option value="Manual">Manual</Option>
                        <Option value="Hybrid">Hybrid (Both)</Option>
                    </Select>
                </div>
            </div>

            {/* Hospital Network */}
            <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900">Hospital Network</label>

                {/* Accredited Hospitals - UPDATED TO HANDLE OBJECTS */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">List of Accredited Hospitals</label>
                    {capabilities.accreditedHospitals.map((hospital, index) => (
                        <div key={index} className="flex gap-4 items-center">
                            <Input
                                type="text"
                                className="h-12 border-gray-300 rounded-md flex-1"
                                value={hospital.address || ""}
                                onChange={(e) => updateAccreditedHospital(index, e.target.value)}
                                placeholder={`Hospital ${index + 1} Name/Address`}
                            />
                            <Button
                                className="h-12 px-4 bg-red-500 text-white rounded-md"
                                onClick={() => deleteAccreditedHospital(index)}
                                disabled={capabilities.accreditedHospitals.length === 1}
                            >
                                Delete
                            </Button>
                        </div>
                    ))}
                    <Button
                        className="h-10 px-4 bg-primarysolid text-white rounded-md"
                        onClick={addAccreditedHospital}
                    >
                        + Add another hospital
                    </Button>
                </div>

                {/* Out-of-Network Reimbursement */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        Are Out-of-Network Treatments Reimbursable?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.outOfNetworkReimbursement}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                outOfNetworkReimbursement: value,
                            }))
                        }
                    >
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>
            </div>

            {/* Integration & Technology - UPDATED FIELD NAMES */}
            <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900">Integration & Technology</label>

                {/* API/Tech Integration - UPDATED FIELD NAME */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        Do you support API or tech integration with platforms like ours?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.supportTechIntegration}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                supportTechIntegration: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                        <Option value="In Development">In Development</Option>
                    </Select>
                </div>

                {/* Real-time Coverage Verification - UPDATED FIELD NAME */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        Can we verify patient coverage in real time?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.canVerifyCoverage}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                canVerifyCoverage: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                        <Option value="In Development">In Development</Option>
                    </Select>
                </div>
            </div>

            {/* Pre-authorization Requirements */}
            <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900">Pre-authorization Requirements</label>

                {/* Pre-authorization Required */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">Is Pre-authorization Required?</label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.preAuthRequired}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                preAuthRequired: value,
                                preAuthorization: value === "No" ? "" : prev.preAuthorization,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>

                {capabilities.preAuthRequired === "Yes" && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-800">
                                Which Treatments Require Pre-authorization?
                            </label>
                            <Input
                                type="text"
                                className="h-12 border-gray-300 rounded-md"
                                value={capabilities.preAuthorization}
                                onChange={(e) =>
                                    setCapabilities((prev) => ({
                                        ...prev,
                                        preAuthorization: e.target.value,
                                    }))
                                }
                                placeholder="e.g., Surgery, Chemotherapy"
                            />
                        </div>

                        {/* Waiting Periods */}
                        <div className="space-y-4">
                            <label className="text-lg font-semibold text-gray-900">Waiting Periods</label>
                            {capabilities.waitingPeriods.map((item, index) => (
                                <div key={index} className="flex gap-4 items-center">
                                    <Input
                                        type="text"
                                        className="h-12 border-gray-300 rounded-md flex-1"
                                        value={item.service}
                                        onChange={(e) => updateWaitingPeriod(index, "service", e.target.value)}
                                        placeholder="Service (e.g., Surgery)"
                                    />
                                    <Input
                                        type="number"
                                        className="h-12 border-gray-300 rounded-md w-20"
                                        value={item.duration}
                                        onChange={(e) => updateWaitingPeriod(index, "duration", e.target.value)}
                                        placeholder="Duration"
                                    />
                                    <Select
                                        className="h-12 w-32"
                                        style={{ height: "48px" }}
                                        value={item.unit || "days"}
                                        onChange={(value) => updateWaitingPeriod(index, "unit", value)}
                                    >
                                        <Option value="days">Days</Option>
                                        <Option value="weeks">Weeks</Option>
                                        <Option value="months">Months</Option>
                                    </Select>
                                    <Button
                                        className="h-12 px-4 bg-red-500 text-white rounded-md"
                                        onClick={() => deleteWaitingPeriod(index)}
                                        disabled={capabilities.waitingPeriods.length === 0}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ))}
                            <Button
                                className="h-10 px-4 bg-primarysolid text-white rounded-md"
                                onClick={addWaitingPeriod}
                            >
                                + Add Service
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Premiums & Co-payments */}
            <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900">Premiums & Co-payments</label>
                
                {/* Co-payments or Deductibles - MOVED HERE */}
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-bold text-gray-800">Are there co-payments or deductibles involved?</label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.conPayments === true ? "Yes" : capabilities.conPayments === false ? "No" : ""}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                conPayments: value === "Yes" ? true : value === "No" ? false : "",
                            }))
                        }
                        placeholder="Select an option"
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                    {capabilities.conPayments === true && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-800">Premiums and Co-payments Structure</label>
                            <TextArea
                                rows={6}
                                className="border-gray-300 rounded-md w-full"
                                value={capabilities.premiumsCopayments}
                                onChange={(e) =>
                                    setCapabilities((prev) => ({
                                        ...prev,
                                        premiumsCopayments: e.target.value,
                                    }))
                                }
                                placeholder="Examples:
• Monthly premium of ₦5000, 20% co-pay on medicines
• Annual premium of ₦50,000, 10% co-pay on all services  
• Monthly premium of ₦10,000, no co-pay
• Quarterly premium of ₦15,000, 15% co-pay on diagnostics
• No premium, 30% co-pay on all services

Please describe your premium and co-payment structure..."
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Regulatory Compliance - UPDATED FIELD NAMES */}
            <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900">Regulatory Compliance</label>

                {/* NHIA Registration - UPDATED FIELD NAME */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">Are you registered with the NHIA (formerly NHIS)?</label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.registeredWithNHIA}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                registeredWithNHIA: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                        <Option value="Application Pending">Application Pending</Option>
                    </Select>
                </div>

                {/* Regulatory Compliance - UPDATED FIELD NAME */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        Do your plans comply with Nigerian healthcare regulations?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.complyWithNigerianHealthCare}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                complyWithNigerianHealthCare: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                        <Option value="Partially">Partially</Option>
                    </Select>
                </div>

                {/* Complaints Handling - UPDATED FIELD NAME */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        How do you handle complaints and customer disputes?
                    </label>
                    <TextArea
                        rows={3}
                        className="border-gray-300 rounded-md"
                        value={capabilities.handleDisputesOrComplaints}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                handleDisputesOrComplaints: e.target.value,
                            }))
                        }
                        placeholder="Describe your complaints and dispute resolution process"
                    />
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
        </div >
    );
};

export default InsuranceForm;