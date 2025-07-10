import React, { useEffect } from 'react';
import { Input } from '../../input';
import { Select } from 'antd';
import { CoreClinicalSpecialities } from '../../enums/medicalSpecialities';
import Subspecialties from '../subspecialities ';
import { OperatingHours } from '../operatingHours';
import { BranchAddresses } from '../BranchAddresses';
import { AdditionalInfo } from '../AdditionalInfo';
import { ToggleSwitch } from '../toggleSwitch';
import { facilityFeatures } from '../utils/initialState';
import { useAuth } from '../../hook/auth';

import NumericInput from '../NumericInput';

const { Option } = Select;

const HospitalForm = ({
    capabilities,
    setCapabilities,
    subSpecialities,
    setSubspecialities,
    timeError,
    validateOperatingHours,
    type,
    typeFacility
}) => {


    const { setIsAmbulance } = useAuth();
    const handleToggleSpecialty = (value) => {
        setCapabilities((prev) => {
            const updated = prev.coreClinicalSpecialities.includes(value)
                ? prev.coreClinicalSpecialities.filter((item) => item !== value)
                : [...prev.coreClinicalSpecialities, value];
            return { ...prev, coreClinicalSpecialities: updated };
        });
    };


    return (
        <>
            <div className="space-y-2">
                <h1 className="text-sm font-bold text-gray-900 mb-2">Core Clinical Specialities</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CoreClinicalSpecialities.map((item) => (
                        <div key={item.value} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm text-gray-800">{item.label}</span>
                            <ToggleSwitch
                                isOn={capabilities.coreClinicalSpecialities.includes(item.value)}
                                onToggle={() => handleToggleSpecialty(item.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <Subspecialties subSpecialities={subSpecialities} setSubspecialities={setSubspecialities} />

            <div className="space-y-2">
                <h1 className="text-sm font-bold text-gray-900 mb-3">Facility Features</h1>
                <div className="flex flex-wrap gap-4">
                    {facilityFeatures.map((feature) => (
                        <label key={feature.id} className="text-sm text-gray-700 flex items-center gap-2">
                            <input
                                type="checkbox"
                                value={feature.id}
                                checked={capabilities.facilityFeatures.includes(feature.id)}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    const updated = checked
                                        ? [...capabilities.facilityFeatures, feature.id]
                                        : capabilities.facilityFeatures.filter((f) => f !== feature.id);
                                    setCapabilities((prev) => ({
                                        ...prev,
                                        facilityFeatures: updated,
                                    }));
                                }}
                                className="h-4 w-4 text-[#359DF4] focus:ring-[#359DF4] border-gray-300 rounded"
                            />
                            {feature.label}
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

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-sm font-bold text-gray-800">Admission Fee (₦)</label>
                    <div className="relative">
                        <NumericInput
                            className="h-12 border-gray-300 rounded-md pr-12"
                            value={capabilities.admissionFee}
                            onChange={(value) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    admissionFee: value,
                                }))
                            }
                            placeholder="Enter amount in ₦"
                            allowDecimals={true}
                            min="0"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                    </div>
                </div>
                <div className="flex-1">
                    <label className="text-sm font-bold text-gray-800">Consultation Fee (₦)</label>
                    <div className="relative">
                        <NumericInput
                            className="h-12 border-gray-300 rounded-md pr-12"
                            value={capabilities.consultationFee}
                            onChange={(value) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    consultationFee: value,
                                }))
                            }
                            placeholder="Enter amount in ₦"
                            allowDecimals={true}
                            min="0"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">Total Bed Space</label>
                <NumericInput
                    className="h-12 border-gray-300 rounded-md"
                    value={capabilities.totalBedSpace}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            totalBedSpace: value,
                        }))
                    }
                    placeholder="Enter number of beds"
                    min="0"
                    max="10000"
                />
            </div>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-bold text-gray-800 mb-1 block">
                        Do you have Laboratory?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.hasLaboratory ? "Yes" : "No"}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                hasLaboratory: value === "Yes",
                            }))
                        }
                        placeholder="Select option"
                    >
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>

                <div>
                    <label className="text-sm font-bold text-gray-800 mb-1 block">
                        Do you have Pharmacy?
                    </label>
                    <Select
                        className="h-12 w-full"
                        style={{ height: "48px" }}
                        value={capabilities.hasPharmacy ? "Yes" : "No"}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                hasPharmacy: value === "Yes",
                            }))
                        }
                        placeholder="Select option"
                    >
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>
            </div>



            {(capabilities?.hasPharmacy || capabilities?.hasLaboratory) && (
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800">
                        Do you allow external patients?
                    </label>
                    <Select
                        className="h-12 border-gray-300 rounded-md w-full"
                        value={capabilities.allowExternalPatients ? "Yes" : "No"}
                        onChange={(value) =>
                            setCapabilities((prev) => ({
                                ...prev,
                                externalPatientsAllowed: value === "Yes",
                            }))
                        }
                    >
                        <Option value="">Select</Option>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>
            )}


            {type !== "ambulance" && (
                <>
                    <BranchAddresses capabilities={capabilities} setCapabilities={setCapabilities} />
                    <AdditionalInfo capabilities={capabilities} setCapabilities={setCapabilities} />
                </>
            )}
        </>
    );
};

export default HospitalForm;