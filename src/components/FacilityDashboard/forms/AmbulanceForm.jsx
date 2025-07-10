// ===== 1. hospitalServices/forms/AmbulanceForm.jsx (Complete) =====
import React from 'react';
import { Input } from '../../input';
import { Select } from 'antd';
import { OperatingHours } from '../operatingHours';
import { BranchAddresses } from '../BranchAddresses';
import { AdditionalInfo } from '../AdditionalInfo';

const { Option } = Select;

const AmbulanceForm = ({ capabilities, setCapabilities, timeError, validateOperatingHours, typeFacility }) => {
    const handleToggleAmbulanceType = (value) => {
        setCapabilities((prev) => {
            const updated = prev.ambulanceTypes.includes(value)
                ? prev.ambulanceTypes.filter((item) => item !== value)
                : [...prev.ambulanceTypes, value];
            return { ...prev, ambulanceTypes: updated };
        });
    };

    const handleToggleVehicleEquipment = (value) => {
        setCapabilities((prev) => {
            const updated = prev.vehicleEquipment.includes(value)
                ? prev.vehicleEquipment.filter((item) => item !== value)
                : [...prev.vehicleEquipment, value];
            return { ...prev, vehicleEquipment: updated };
        });
    };

    const handleToggleCrew = (value) => {
        setCapabilities((prev) => {
            const updated = prev.typicalCrew.includes(value)
                ? prev.typicalCrew.filter((item) => item !== value)
                : [...prev.typicalCrew, value];
            return { ...prev, typicalCrew: updated };
        });
    };

    return (
        <>
            <div className="space-y-2">
                <h1 className="text-sm font-bold text-gray-900 mb-2">Ambulance Types</h1>
                <div className="flex flex-wrap gap-4">
                    {["Basic Life Support (BLS)", "Advanced Support ALS", "Neonatal/ICU Transport"].map((type) => (
                        <label key={type} className="text-sm text-gray-700 flex items-center gap-2">
                            <input
                                type="checkbox"
                                value={type}
                                checked={capabilities.ambulanceTypes.includes(type)}
                                onChange={() => handleToggleAmbulanceType(type)}
                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                            />
                            {type}
                        </label>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <h1 className="text-sm font-bold text-gray-900 mb-2">Vehicle Equipment Checklist</h1>
                <div className="flex flex-wrap gap-4">
                    {["Cardiac Monitor", "Oxygen & Suction Units", "Stretchers", "Ventilators"].map((equipment) => (
                        <label key={equipment} className="text-sm text-gray-700 flex items-center gap-2">
                            <input
                                type="checkbox"
                                value={equipment}
                                checked={capabilities.vehicleEquipment.includes(equipment)}
                                onChange={() => handleToggleVehicleEquipment(equipment)}
                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                            />
                            {equipment}
                        </label>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <h1 className="text-sm font-bold text-gray-900 mb-2">Typical Crew per Ambulance</h1>
                <div className="flex flex-wrap gap-4">
                    {["Driver", "Paramedic", "Nurse", "Doctor"].map((crew) => (
                        <label key={crew} className="text-sm text-gray-700 flex items-center gap-2">
                            <input
                                type="checkbox"
                                value={crew}
                                checked={capabilities.typicalCrew.includes(crew)}
                                onChange={() => handleToggleCrew(crew)}
                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                            />
                            {crew}
                        </label>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1 max-w-[150px]">
                        <label className="text-sm font-medium text-gray-800 block mb-1">
                            Avg Response Time (Min)
                        </label>
                        <Input
                            type="number"
                            className="h-10 border-gray-300 rounded-md text-sm"
                            value={capabilities.averageResponseMin}
                            onChange={(e) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    averageResponseMin: e.target.value,
                                }))
                            }
                            placeholder="Min"
                        />
                    </div>
                    <div className="flex-1 max-w-[150px]">
                        <label className="text-sm font-medium text-gray-800 block mb-1">
                            Avg Response Time (Sec)
                        </label>
                        <Input
                            type="number"
                            className="h-10 border-gray-300 rounded-md text-sm"
                            value={capabilities.averageResponseSec}
                            onChange={(e) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    averageResponseSec: e.target.value,
                                }))
                            }
                            placeholder="Sec"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-800">No Roadworthy Ambulances</label>
                        <Input
                            type="number"
                            className="h-12 border-gray-300 rounded-md"
                            value={capabilities.noRoadworthyAmbulances}
                            onChange={(e) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    noRoadworthyAmbulances: e.target.value,
                                }))
                            }
                            placeholder="Enter number"
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-800">Max Daily Trips</label>
                        <Input
                            type="number"
                            className="h-12 border-gray-300 rounded-md"
                            value={capabilities.maxDailyTrips}
                            onChange={(e) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    maxDailyTrips: e.target.value,
                                }))
                            }
                            placeholder="Enter number"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-800">Do you have Backup Vehicles?</label>
                        <Select
                            className="h-12 w-full"
                            style={{ height: "48px" }}
                            value={capabilities.hasBackupVehicles}
                            onChange={(value) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    hasBackupVehicles: value,
                                }))
                            }
                        >
                            <Option value="">Select</Option>
                            <Option value="Yes">Yes</Option>
                            <Option value="No">No</Option>
                        </Select>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-800">Pay per Trip Flat Rates (₦)</label>
                        <div className="relative">
                            <Input
                                type="number"
                                className="h-12 border-gray-300 rounded-md pr-12"
                                value={capabilities.payPerTrip}
                                onChange={(e) =>
                                    setCapabilities((prev) => ({
                                        ...prev,
                                        payPerTrip: e.target.value,
                                    }))
                                }
                                placeholder="Enter amount in ₦"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                ₦
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-800">NHIS / Insurance Accepted?</label>
                        <Select
                            className="h-12 w-full"
                            style={{ height: "48px" }}
                            value={capabilities.nhisInsuranceAccepted}
                            onChange={(value) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    nhisInsuranceAccepted: value,
                                }))
                            }
                        >
                            <Option value="">Select</Option>
                            <Option value="Yes">Yes</Option>
                            <Option value="No">No</Option>
                        </Select>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-800">
                            Registered with Federal Ministry of Health?
                        </label>
                        <Select
                            className="h-12 w-full"
                            style={{ height: "48px" }}
                            value={capabilities.registeredWithFMOH}
                            onChange={(value) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    registeredWithFMOH: value,
                                }))
                            }
                        >
                            <Option value="">Select</Option>
                            <Option value="Yes">Yes</Option>
                            <Option value="No">No</Option>
                        </Select>
                    </div>
                </div>
            </div>

            {typeFacility === "Ambulance" && (
                <>
                    <OperatingHours
                        capabilities={capabilities}
                        setCapabilities={setCapabilities}
                        timeError={timeError}
                        validateOperatingHours={validateOperatingHours}
                    />
                    <BranchAddresses capabilities={capabilities} setCapabilities={setCapabilities} />
                </>
            )}

            <AdditionalInfo capabilities={capabilities} setCapabilities={setCapabilities} />
        </>
    );
};

export default AmbulanceForm;
