import React from 'react';
import { Select, Input, InputNumber } from 'antd';
import { OperatingHours } from '../operatingHours';
import { BranchAddresses } from '../BranchAddresses';
import { AdditionalInfo } from '../AdditionalInfo';

const { Option } = Select;
const { TextArea } = Input;

const BloodBankForm = ({ capabilities, setCapabilities, timeError, validateOperatingHours }) => {
    const handleToggleBloodProduct = (value) => {
        setCapabilities((prev) => {
            let updated;

            if (value === "All") {
                const allProducts = ["All", "Whole blood", "RBCs", "Platelets", "Plasma", "Cryoprecipitate"];
                updated = prev.bloodProductsProvided.includes("All") ? [] : allProducts;
            } else {
                if (prev.bloodProductsProvided.includes(value)) {
                    updated = prev.bloodProductsProvided.filter((item) => item !== value && item !== "All");
                } else {
                    updated = [...prev.bloodProductsProvided.filter((item) => item !== "All"), value];

                    const individualProducts = ["Whole blood", "RBCs", "Platelets", "Plasma", "Cryoprecipitate"];
                    if (individualProducts.every(product => updated.includes(product))) {
                        updated = ["All", ...individualProducts];
                    }
                }
            }

            return { ...prev, bloodProductsProvided: updated };
        });
    };

    const handleToggleDonationSystem = (value) => {
        setCapabilities((prev) => {
            const updated = prev.donationSystems.includes(value)
                ? prev.donationSystems.filter((item) => item !== value)
                : [...prev.donationSystems, value];
            return { ...prev, donationSystems: updated };
        });
    };

    return (
        <>
            <div className="space-y-2">
                <h1 className="text-sm font-bold text-gray-900 mb-2">What types of blood products do you provide?</h1>
                <div className="flex flex-wrap gap-4">
                    {["All", "Whole blood", "RBCs", "Platelets", "Plasma", "Cryoprecipitate"].map((product) => (
                        <label key={product} className="text-sm text-gray-700 flex items-center gap-2">
                            <input
                                type="checkbox"
                                value={product}
                                checked={capabilities.bloodProductsProvided.includes(product)}
                                onChange={() => handleToggleBloodProduct(product)}
                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                            />
                            {product}
                        </label>
                    ))}
                </div>
            </div>

            {/* Infections Tested Section */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">
                    What infections and conditions are tested for before release?
                </label>
                <TextArea
                    placeholder="e.g., HIV, Hepatitis B/C, Syphilis, Malaria, etc."
                    value={capabilities.infectionsTestedFor}
                    onChange={(e) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            infectionsTestedFor: e.target.value,
                        }))
                    }
                    rows={3}
                />
            </div>

            {/* Inventory and Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800">
                        Current blood inventory capacity
                    </label>
                    <Input
                        placeholder="e.g., 500 units"
                        value={capabilities.currentBloodInventoryCapacity}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                currentBloodInventoryCapacity: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800">
                        Average blood collection time
                    </label>
                    <Input
                        placeholder="e.g., 15-20 minutes"
                        value={capabilities.averageBloodCollectionTime}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                averageBloodCollectionTime: e.target.value,
                            }))
                        }
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">
                    Maximum storage capacity for each blood component
                </label>
                <TextArea
                    placeholder="e.g., Whole blood: 200 units, RBCs: 150 units, Platelets: 100 units"
                    value={capabilities.maxStorageCapacityPerComponent}
                    onChange={(e) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            maxStorageCapacityPerComponent: e.target.value,
                        }))
                    }
                    rows={2}
                />
            </div>

            {/* Operational Standards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800">
                        Do you have mobile donation units?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.hasMobileDonationUnits}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                hasMobileDonationUnits: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800">
                        Are all phlebotomists certified?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.allPhlebotomistsCertified}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                allPhlebotomistsCertified: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800">
                        Do you accept returned blood?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.acceptsReturnedBlood}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                acceptsReturnedBlood: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>

                {capabilities.acceptsReturnedBlood === "Yes" && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-800">
                            Return time frame
                        </label>
                        <Input
                            placeholder="e.g., Within 24 hours"
                            value={capabilities.returnTimeFrame}
                            onChange={(e) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    returnTimeFrame: e.target.value,
                                }))
                            }
                        />
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">
                    Can patients request blood directly (walk-in support)?
                </label>
                <Select
                    className="h-12 w-full"
                    style={{ height: "48px" }}
                    value={capabilities.allowsDirectPatientRequests}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            allowsDirectPatientRequests: value,
                        }))
                    }
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>

            {/* Logistics & Delivery */}
            <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Logistics & Delivery</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-800">
                            Do you provide emergency delivery?
                        </label>
                        <Select
                            className="h-12 w-full"
                            style={{ height: "48px" }}
                            value={capabilities.providesEmergencyDelivery}
                            onChange={(value) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    providesEmergencyDelivery: value,
                                }))
                            }
                        >
                            <Option value="">Select</Option>
                            <Option value="Yes">Yes</Option>
                            <Option value="No">No</Option>
                        </Select>
                    </div>

                    {capabilities.providesEmergencyDelivery === "Yes" && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-800">
                                Average emergency response time
                            </label>
                            <Input
                                placeholder="e.g., 30 minutes"
                                value={capabilities.emergencyResponseTime}
                                onChange={(e) =>
                                    setCapabilities((prev) => ({
                                        ...prev,
                                        emergencyResponseTime: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-800">
                            Logistics type
                        </label>
                        <Select
                            className="h-12 w-full"
                            style={{ height: "48px" }}
                            value={capabilities.logisticsType}
                            onChange={(value) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    logisticsType: value,
                                }))
                            }
                        >
                            <Option value="">Select</Option>
                            <Option value="Own logistics">Own logistics</Option>
                            <Option value="Third-party delivery">Third-party delivery</Option>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-800">
                            Do you charge for delivery?
                        </label>
                        <Select
                            className="h-12 w-full"
                            style={{ height: "48px" }}
                            value={capabilities.chargesForDelivery}
                            onChange={(value) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    chargesForDelivery: value,
                                }))
                            }
                        >
                            <Option value="">Select</Option>
                            <Option value="Yes">Yes</Option>
                            <Option value="No">No</Option>
                        </Select>
                    </div>
                </div>

                {capabilities.chargesForDelivery === "Yes" && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-800">
                            Delivery cost (₦)
                        </label>
                        <InputNumber
                            className="w-full"
                            placeholder="e.g., 5000"
                            value={capabilities.deliveryCost}
                            onChange={(value) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    deliveryCost: value?.toString() || "",
                                }))
                            }
                            min={0}
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800">
                        Cold chain preservation procedures
                    </label>
                    <TextArea
                        placeholder="Describe your procedures for maintaining cold chain during delivery"
                        value={capabilities.coldChainProcedures}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                coldChainProcedures: e.target.value,
                            }))
                        }
                        rows={3}
                    />
                </div>
            </div>

            {/* Pricing & Payment */}
            <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Payment</h2>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800">
                        Cost for each type of blood product
                    </label>
                    <TextArea
                        placeholder="e.g., Whole blood: ₦15,000, RBCs: ₦12,000, Platelets: ₦25,000"
                        value={capabilities.bloodProductCosts}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                bloodProductCosts: e.target.value,
                            }))
                        }
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800">
                        Do you accept insurance as payment?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.bloodBankAcceptsInsurance}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                bloodBankAcceptsInsurance: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>
            </div>

            {/* Donor Recruitment & Retention */}
            <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Donor Recruitment & Retention</h2>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800">
                        How do you recruit donors?
                    </label>
                    <TextArea
                        placeholder="Describe your donor recruitment methods"
                        value={capabilities.donorRecruitmentMethods}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                donorRecruitmentMethods: e.target.value,
                            }))
                        }
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800">
                        Do you have a donor retention strategy?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.hasDonorRetentionStrategy}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                hasDonorRetentionStrategy: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>

                <div className="space-y-2">
                    <h1 className="text-sm font-bold text-gray-900 mb-2">Donation Systems Offered</h1>
                    <div className="flex flex-wrap gap-4">
                        {["Voluntary", "Replacement", "Paid"].map((system) => (
                            <label key={system} className="text-sm text-gray-700 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value={system}
                                    checked={capabilities.donationSystems.includes(system)}
                                    onChange={() => handleToggleDonationSystem(system)}
                                    className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                                />
                                {system}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Certification */}
            <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Certification</h2>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800">
                        What accreditations or certifications does your lab have?
                    </label>
                    <TextArea
                        placeholder="e.g., NAFDAC, MLSCN, WHO standards, etc."
                        value={capabilities.bloodBankAccreditations}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                bloodBankAccreditations: e.target.value,
                            }))
                        }
                        rows={3}
                    />
                </div>
            </div>

            {/* Management Fields */}
            <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Management & Operations</h2>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800">
                        How do you manage shortages or excess demand?
                    </label>
                    <TextArea
                        placeholder="Describe your shortage management procedures"
                        value={capabilities.shortageManagement}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                shortageManagement: e.target.value,
                            }))
                        }
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800">
                        How do you track expiry dates and maintain viability?
                    </label>
                    <TextArea
                        placeholder="Describe your expiry tracking and viability maintenance procedures"
                        value={capabilities.expiryDateTracking}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                expiryDateTracking: e.target.value,
                            }))
                        }
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800">
                        How often do you conduct internal audits?
                    </label>
                    <Input
                        placeholder="e.g., Monthly, Quarterly, etc."
                        value={capabilities.auditFrequency}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                auditFrequency: e.target.value,
                            }))
                        }
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
        </>
    );
};

export default BloodBankForm;