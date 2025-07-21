import React, { useEffect } from 'react';
import { Select, Input, InputNumber, TimePicker } from 'antd';
import { OperatingHours } from '../operatingHours';
import { BranchAddresses } from '../BranchAddresses';
import { AdditionalInfo } from '../AdditionalInfo';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const BloodBankForm = ({ capabilities, setCapabilities, timeError, validateOperatingHours }) => {


    useEffect(()=>{

        console.log(capabilities.currentBloodInventoryCapacity, "capabilities from blood bank are here");

    },[capabilities])
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
            {/* Blood Products Section */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Blood Products & Services</h2>
                
                <div className="space-y-2">
                    <h1 className="text-sm font-bold text-gray-900 mb-2">What types of blood products do you provide? (All, Whole blood, RBCs, platelets, plasma, cryoprecipitate.)</h1>
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
            </div>

            {/* Screening and Safety Section */}
            <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Screening and Safety</h2>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        What infections and conditions are tested for before release? (HIV, Hepatitis B/C, Syphilis, Malaria, etc.)
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
                        rows={4}
                        style={{ height: '120px' }}
                    />
                </div>
            </div>

            {/* Inventory and Capacity Section */}
            <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory and Capacity</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800">
                            What is your current blood inventory capacity?
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
                            style={{ height: '48px' }}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800">
                            What is your average blood collection time?
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
                            style={{ height: '48px' }}
                        />
                    </div>
                </div>

                <div className="space-y-2 mb-2">
                    <label className="text-sm font-bold text-gray-800 mb-2">
                        What is your maximum storage capacity for each blood component?
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
                        rows={3}
                        style={{ height: '100px' }}
                    />
                </div>

                <div className="space-y-2 mb-2">
                    <label className="text-sm font-bold text-gray-800">
                        How do you manage shortages or excess demand for specific blood types?
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
                        rows={4}
                        style={{ height: '120px' }}
                    />
                </div>

                <div className="space-y-2 mb-2">
                    <label className="text-sm font-bold text-gray-800">
                        How do you track expiry dates and maintain blood product viability?
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
                        rows={4}
                        style={{ height: '120px' }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800">
                            Do you have mobile donation units or satellite locations that expand your reach?
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
                        <label className="text-sm font-bold text-gray-800">
                            What is your typical daily or weekly request volume from partner facilities?
                        </label>
                        <Input
                            placeholder="e.g., 50 units daily or 300 units weekly"
                            value={capabilities.typicalRequestVolume}
                            onChange={(e) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    typicalRequestVolume: e.target.value,
                                }))
                            }
                            style={{ height: '48px' }}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        How do you manage blood expiry?
                    </label>
                    <TextArea
                        placeholder="Describe your blood expiry management procedures"
                        value={capabilities.bloodExpiryManagement}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                bloodExpiryManagement: e.target.value,
                            }))
                        }
                        rows={3}
                        style={{ height: '100px' }}
                    />
                </div>
            </div>

            {/* Operational Standards Section */}
            <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4"> Operational Standards</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800">
                            Do you accept returned blood if it's no longer needed?
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
                            <label className="text-sm font-bold text-gray-800">
                                What is the allowable time frame for such returns?
                            </label>
                            <TimePicker
                                placeholder="Select time frame"
                                value={capabilities.returnTimeFrame ? dayjs(capabilities.returnTimeFrame, 'HH:mm') : null}
                                onChange={(time) =>
                                    setCapabilities((prev) => ({
                                        ...prev,
                                        returnTimeFrame: time ? time.format('HH:mm') : '',
                                    }))
                                }
                                format="HH:mm"
                                style={{ height: '48px', width: '100%' }}
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800">
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

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800">
                            How often do you conduct internal audits or receive external reviews?
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
                            style={{ height: '48px' }}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        Can patients or their families request blood directly through your facility (walk-in support)?
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
            </div>

            {/* Logistics & Delivery Section */}
            <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4"> Logistics & Delivery</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800">
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
                            <label className="text-sm font-bold text-gray-800">
                                What is the average response time?
                            </label>
                            <TimePicker
                                placeholder="Select average response time"
                                value={capabilities.emergencyResponseTime ? dayjs(capabilities.emergencyResponseTime, 'HH:mm') : null}
                                onChange={(time) =>
                                    setCapabilities((prev) => ({
                                        ...prev,
                                        emergencyResponseTime: time ? time.format('HH:mm') : '',
                                    }))
                                }
                                format="HH:mm"
                                style={{ height: '48px', width: '100%' }}
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800">
                            Do you operate your own logistics fleet or rely on third-party delivery services?
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
                        <label className="text-sm font-bold text-gray-800">
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
                        <label className="text-sm font-bold text-gray-800">
                            What is the cost of delivery? (₦)
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
                            style={{ height: '48px' }}
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        What are your logistics procedures for preserving the cold chain during delivery?
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
                        rows={4}
                        style={{ height: '120px' }}
                    />
                </div>

                <div className="space-y-2 mt-2">
                    <label className="text-sm font-bold text-gray-800">
                        Is it possible to get priority dispatch for high-risk patients or critical partner facilities?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.providesPriorityDispatch}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                providesPriorityDispatch: value,
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        What are your average turnaround times from request to delivery for emergency and non-emergency cases?
                    </label>
                    <TextArea
                        placeholder="e.g., Emergency: 30 minutes, Non-emergency: 2 hours"
                        value={capabilities.averageTurnaroundTimes}
                        onChange={(e) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                averageTurnaroundTimes: e.target.value,
                            }))
                        }
                        rows={3}
                        style={{ height: '100px' }}
                    />
                </div>
            </div>

            {/* Pricing & Payment Section */}
            <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4"> Pricing & Payment</h2>

                <div className="space-y-2 mb-2">
                    <label className="text-sm font-bold text-gray-800">
                        What is the cost for each type of blood product?
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
                        rows={4}
                        style={{ height: '120px' }}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800 mt-2">
                        Do you accept insurance as a method of payment?
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

            {/* Donor Recruitment & Retention Section */}
            <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4"> Donor Recruitment & Retention</h2>

                <div className="space-y-2 mb-2">
                    <label className="text-sm font-bold text-gray-800">
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
                        rows={4}
                        style={{ height: '120px' }}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
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
                    <h1 className="text-sm font-bold text-gray-900 mb-2">Do you offer voluntary, replacement, or paid donation systems?</h1>
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

            {/* Certification Section */}
            <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Certification</h2>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        What accreditations or certifications does your lab have (e.g., NAFDAC, MLSCN, WHO standards)?
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
                        rows={4}
                        style={{ height: '120px' }}
                    />
                </div>
            </div>

            {/* Operating Hours */}
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