import React, { useEffect } from 'react';
import { Input } from '../../input';
import { Button } from '../../button';
import { Select } from 'antd';
import TextArea from "antd/es/input/TextArea";
import { BranchAddresses } from '../BranchAddresses';
import { AdditionalInfo } from '../AdditionalInfo';
import { OperatingHours } from '../operatingHours';

const { Option } = Select;

const InsuranceForm = ({ capabilities, setCapabilities, timeError, validateOperatingHours }) => {
    const addAccreditedHospital = () => {
        setCapabilities((prev) => ({
            ...prev,
            accreditedHospitals: [...prev.accreditedHospitals, ""],
        }));
    };

    const updateAccreditedHospital = (index, value) => {
        setCapabilities((prev) => {
            const updatedHospitals = [...prev.accreditedHospitals];
            updatedHospitals[index] = value;
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

    const addClaimDocument = () => {
        setCapabilities((prev) => ({
            ...prev,
            complianceDocuments: [...prev.complianceDocuments, { type: "", name: "", file: null }],
        }));
    };

    const updateClaimDocument = (index, field, value) => {
        setCapabilities((prev) => {
            const updatedDocs = [...prev.complianceDocuments];
            updatedDocs[index] = { ...updatedDocs[index], [field]: value };
            return { ...prev, complianceDocuments: updatedDocs };
        });
    };

    const deleteClaimDocument = (index) => {
        setCapabilities((prev) => {
            const updatedDocs = prev.complianceDocuments.filter((_, i) => i !== index);
            return { ...prev, complianceDocuments: updatedDocs };
        });
    };

    useEffect(() => {
        console.log(capabilities, "capabilities are here");
    }, [capabilities]);

    return (
        <div className="space-y-6">
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
                        Coverage for Emergency Services and Ambulance Transport
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
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>
            </div>

            {/* Emergency Care Access */}
            <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900">Emergency Care Access</label>

                {/* Ambulance and Emergency Services */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        Are ambulance and emergency services included in your coverage?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.ambulanceEmergencyIncluded}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                ambulanceEmergencyIncluded: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes, Fully Covered</Option>
                        <Option value="Partial">Partially Covered</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>

                {capabilities.ambulanceEmergencyIncluded === "Partial" && (
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800">
                            Please specify what emergency services are covered
                        </label>
                        <TextArea
                            rows={3}
                            className="border-gray-300 rounded-md"
                            value={capabilities.partialEmergencyCoverage}
                            onChange={(e) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    partialEmergencyCoverage: e.target.value,
                                }))
                            }
                            placeholder="e.g., Emergency room visits covered, ambulance transport not covered"
                        />
                    </div>
                )}

                {/* Emergency Coverage Limitations */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        Are there any limitations or conditions for emergency care coverage?
                    </label>
                    <TextArea
                        rows={3}
                        className="border-gray-300 rounded-md"
                        value={capabilities.emergencyCoverageLimitations}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                emergencyCoverageLimitations: e.target.value,
                            }))
                        }
                        placeholder="e.g., Pre-approval required for non-life threatening emergencies"
                    />
                </div>
            </div>

            {/* Claim Process */}
            <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900">Claim Process</label>

                {/* Claims Processing Procedure */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">What is your claims processing procedure?</label>
                    <TextArea
                        rows={4}
                        className="border-gray-300 rounded-md"
                        value={capabilities.claimsProcessingProcedure}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                claimsProcessingProcedure: e.target.value,
                            }))
                        }
                        placeholder="Describe your step-by-step claims processing procedure"
                    />
                </div>

                {/* Claims Settlement Time */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">How long does it take to settle provider claims?</label>
                    <Input
                        type="text"
                        className="h-12 border-gray-300 rounded-md"
                        value={capabilities.claimsSettlementTime}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                claimsSettlementTime: e.target.value,
                            }))
                        }
                        placeholder="e.g., 7-14 business days"
                    />
                </div>

                {/* Co-payments or Deductibles */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">Are there co-payments or deductibles involved?</label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.hasCopaymentsDeductibles}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                hasCopaymentsDeductibles: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>

                {/* Rejected Claims Handling */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">How do you handle rejected or disputed claims?</label>
                    <TextArea
                        rows={3}
                        className="border-gray-300 rounded-md"
                        value={capabilities.rejectedClaimsProcess}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                rejectedClaimsProcess: e.target.value,
                            }))
                        }
                        placeholder="Describe your process for handling rejected or disputed claims"
                    />
                </div>

                {/* Payment System Type */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">Is your payment system automated or manual?</label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.paymentSystemType}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                paymentSystemType: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Automated">Automated</Option>
                        <Option value="Manual">Manual</Option>
                        <Option value="Hybrid">Hybrid (Both)</Option>
                    </Select>
                </div>

                {/* Reimbursement-based Plans */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        Do you offer reimbursement-based plans? (Pay first, then file claim)
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.offersReimbursementPlans}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                offersReimbursementPlans: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>
            </div>

            {/* Hospital Network */}
            <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900">Hospital Network</label>

                {/* Accredited Hospitals */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">List of Accredited Hospitals</label>
                    {capabilities.accreditedHospitals.map((hospital, index) => (
                        <div key={index} className="flex gap-4 items-center">
                            <Input
                                type="text"
                                className="h-12 border-gray-300 rounded-md flex-1"
                                value={hospital}
                                onChange={(e) => updateAccreditedHospital(index, e.target.value)}
                                placeholder={`Hospital ${index + 1} Name`}
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

            {/* Integration & Technology */}
            <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900">Integration & Technology</label>

                {/* API/Tech Integration */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        Do you support API or tech integration with platforms like ours?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.supportsApiIntegration}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                supportsApiIntegration: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                        <Option value="In Development">In Development</Option>
                    </Select>
                </div>

                {/* Real-time Coverage Verification */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        Can we verify patient coverage in real time?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.realTimeCoverageVerification}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                realTimeCoverageVerification: value,
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

            {/* Family/Dependent Coverage */}
            <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900">Family or Dependent Coverage</label>

                {/* Family Coverage Available */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        Can patients add spouse, children, or elderly parents?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.offersFamilyCoverage}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                offersFamilyCoverage: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>

                {capabilities.offersFamilyCoverage === "Yes" && (
                    <>
                        {/* Cost per Dependent */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-800">What's the cost per dependent?</label>
                            <Input
                                type="text"
                                className="h-12 border-gray-300 rounded-md"
                                value={capabilities.costPerDependent}
                                onChange={(e) =>
                                    setCapabilities((prev) => ({
                                        ...prev,
                                        costPerDependent: e.target.value,
                                    }))
                                }
                                placeholder="e.g., ₦2,500 per month per dependent"
                            />
                        </div>

                        {/* Full Benefits for Dependents */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-800">
                                Do dependents get full benefits?
                            </label>
                            <Select
                                className="h-12 w-full"
                                style={{ height: "48px" }}
                                value={capabilities.dependentsFullBenefits}
                                onChange={(value) =>
                                    setCapabilities((prev) => ({
                                        ...prev,
                                        dependentsFullBenefits: value,
                                    }))
                                }
                            >
                                <Option value="">Select</Option>
                                <Option value="Yes">Yes</Option>
                                <Option value="No">No</Option>
                                <Option value="Limited">Limited Benefits</Option>
                            </Select>
                        </div>
                    </>
                )}
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
                                className="h-10 px-4 bg-cyan-500 text-white rounded-md"
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
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">Premiums and Co-payments Structure</label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.premiumsCopayments}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                premiumsCopayments: value,
                            }))
                        }
                        placeholder="Select premium and co-payment structure"
                    >
                        <Option value="">Select</Option>
                        <Option value="Monthly premium of ₦5000, 20% co-pay on medicines">
                            Monthly premium of ₦5000, 20% co-pay on medicines
                        </Option>
                        <Option value="Annual premium of ₦50,000, 10% co-pay on all services">
                            Annual premium of ₦50,000, 10% co-pay on all services
                        </Option>
                        <Option value="Monthly premium of ₦10,000, no co-pay">
                            Monthly premium of ₦10,000, no co-pay
                        </Option>
                        <Option value="Quarterly premium of ₦15,000, 15% co-pay on diagnostics">
                            Quarterly premium of ₦15,000, 15% co-pay on diagnostics
                        </Option>
                        <Option value="No premium, 30% co-pay on all services">
                            No premium, 30% co-pay on all services
                        </Option>
                    </Select>
                </div>
            </div>

            {/* Regulatory Compliance */}
            <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900">Regulatory Compliance</label>

                {/* NHIA Registration */}
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

                {/* Regulatory Compliance */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        Do your plans comply with Nigerian healthcare regulations?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.compliesWithRegulations}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                compliesWithRegulations: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                        <Option value="Partially">Partially</Option>
                    </Select>
                </div>

                {/* Complaints Handling */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        How do you handle complaints and customer disputes?
                    </label>
                    <TextArea
                        rows={3}
                        className="border-gray-300 rounded-md"
                        value={capabilities.complaintsHandlingProcess}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                complaintsHandlingProcess: e.target.value,
                            }))
                        }
                        placeholder="Describe your complaints and dispute resolution process"
                    />
                </div>

                {/* Document Upload Section */}
                <div className="space-y-4">
                    <label className="text-lg font-semibold text-gray-900">Required Documents</label>
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                        <p className="text-sm text-blue-800 font-medium mb-2">
                            📋 Please upload the following required documents:
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• <strong>NHIA License:</strong> Ensure the company is licensed by NHIA (National Health Insurance Authority)</li>
                            <li>• <strong>Benefit Schedule/Plan Brochure:</strong> Document showing all services covered, usage frequency, and costs</li>
                            <li>• <strong>Regulatory Compliance Certificate:</strong> Proof of compliance with Nigerian healthcare regulations</li>
                        </ul>
                    </div>
                    
                    {/* NHIA License Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800">
                            NHIA License <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    nhiaLicenseDocument: e.target.files[0],
                                }))
                            }
                            className="w-full h-12 border border-gray-300 rounded-md px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {capabilities.nhiaLicenseDocument && (
                            <p className="text-sm text-green-600">
                                ✓ File selected: {capabilities.nhiaLicenseDocument.name}
                            </p>
                        )}
                    </div>

                    {/* Benefit Schedule/Plan Brochure Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800">
                            Benefit Schedule/Plan Brochure <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    benefitScheduleDocument: e.target.files[0],
                                }))
                            }
                            className="w-full h-12 border border-gray-300 rounded-md px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {capabilities.benefitScheduleDocument && (
                            <p className="text-sm text-green-600">
                                ✓ File selected: {capabilities.benefitScheduleDocument.name}
                            </p>
                        )}
                    </div>

                    {/* Regulatory Compliance Certificate Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800">
                            Regulatory Compliance Certificate <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    complianceCertificateDocument: e.target.files[0],
                                }))
                            }
                            className="w-full h-12 border border-gray-300 rounded-md px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {capabilities.complianceCertificateDocument && (
                            <p className="text-sm text-green-600">
                                ✓ File selected: {capabilities.complianceCertificateDocument.name}
                            </p>
                        )}
                    </div>

                    {/* Additional Supporting Documents (Optional) */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800">
                            Additional Supporting Documents (Optional)
                        </label>
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    additionalDocuments: Array.from(e.target.files),
                                }))
                            }
                            className="w-full h-12 border border-gray-300 rounded-md px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                        />
                        {capabilities.additionalDocuments && capabilities.additionalDocuments.length > 0 && (
                            <div className="text-sm text-green-600">
                                <p>✓ {capabilities.additionalDocuments.length} additional file(s) selected:</p>
                                <ul className="ml-4 mt-1 space-y-1">
                                    {capabilities.additionalDocuments.map((file, index) => (
                                        <li key={index}>• {file.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
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
        </div>
    );
};

export default InsuranceForm;