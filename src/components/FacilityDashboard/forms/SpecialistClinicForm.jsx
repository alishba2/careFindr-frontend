
// ===== 3. hospitalServices/forms/SpecialistClinicForm.jsx =====
import React from 'react';
import { Select } from 'antd';
import { Input } from '../../input';
import TextArea from "antd/es/input/TextArea";

import { OperatingHours } from '../operatingHours';
import { BranchAddresses } from '../BranchAddresses';
import { AdditionalInfo } from '../AdditionalInfo';


const { Option } = Select;

const SpecialistClinicForm = ({ capabilities, setCapabilities, timeError, validateOperatingHours }) => {
    return (
        <div className="space-y-6">
            {/* Core and Specialized Services */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    What are the core and specialized medical services or procedures you provide?
                </label>
                <TextArea
                    rows={3}
                    className="border-gray-300 rounded-md"
                    value={capabilities.coreServices}
                    onChange={(e) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            coreServices: e.target.value,
                        }))
                    }
                    placeholder="e.g., Dialysis, Fertility Treatment"
                />
            </div>

            {/* Inpatient/Outpatient Care */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Do you offer inpatient or outpatient care (or both)?
                </label>
                <Select
                    className="h-12 w-full"
                    value={capabilities.careType}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            careType: value,
                        }))
                    }
                >
                    <Option value="">Select</Option>
                    <Option value="Inpatient">Inpatient</Option>
                    <Option value="Outpatient">Outpatient</Option>
                    <Option value="Both">Both</Option>
                </Select>
            </div>

            {/* On-Site Doctor/Specialist */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Is a medical doctor or specialist always available on-site?
                </label>
                <Select
                    className="h-12 w-full"
                    value={capabilities.onSiteDoctor}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            onSiteDoctor: value,
                        }))
                    }
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>

            {/* Emergency Response Plan */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Do you have an in-house emergency response plan?
                </label>
                <Select
                    className="h-12 w-full"
                    value={capabilities.emergencyResponsePlan}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            emergencyResponsePlan: value,
                        }))
                    }
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>

            {/* Critical Care */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">Are you equipped for critical care?</label>
                <Select
                    className="h-12 w-full"
                    value={capabilities.criticalCare}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            criticalCare: value,
                        }))
                    }
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>

            {/* Multidisciplinary Care */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">Do you offer multidisciplinary care?</label>
                <TextArea
                    rows={3}
                    className="border-gray-300 rounded-md"
                    value={capabilities.multidisciplinaryCare}
                    onChange={(e) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            multidisciplinaryCare: e.target.value,
                        }))
                    }
                    placeholder="e.g., Dieticians, Mental Health"
                />
            </div>

            {/* Bed Capacity */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    What is your bed capacity (if applicable)?
                </label>
                <Input
                    type="number"
                    className="h-12 border-gray-300 rounded-md"
                    value={capabilities.bedCapacity}
                    onChange={(e) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            bedCapacity: e.target.value,
                        }))
                    }
                    placeholder="Enter number of beds"
                />
            </div>

            {/* Home Services */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Can your facility accommodate home services or mobile health?
                </label>
                <Select
                    className="h-12 w-full"
                    value={capabilities.homeServices}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            homeServices: value,
                        }))
                    }
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>

            {/* Online Booking */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">Do you support online pre-booking?</label>
                <Select
                    className="h-12 w-full"
                    value={capabilities.onlineBooking}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            onlineBooking: value,
                        }))
                    }
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>

            {/* 24/7 Availability */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">Are your services available 24/7?</label>
                <Select
                    className="h-12 w-full"
                    value={capabilities.is24Hour}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            is24Hour: value,
                        }))
                    }
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>

            {/* Operating Hours if not 24/7 */}
            {capabilities.is24Hour === "No" && (
                <OperatingHours 
                    capabilities={capabilities} 
                    setCapabilities={setCapabilities} 
                    timeError={timeError}
                    validateOperatingHours={validateOperatingHours}
                />
            )}

            {/* Daily Patient Limit */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Do you have any limitations on the number of patients per day?
                </label>
                <Input
                    type="text"
                    className="h-12 border-gray-300 rounded-md"
                    value={capabilities.patientLimit}
                    onChange={(e) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            patientLimit: e.target.value,
                        }))
                    }
                    placeholder="e.g., 50 patients"
                />
            </div>

            {/* Public Holiday Work */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">Do you work on public holidays?</label>
                <Select
                    className="h-12 w-full"
                    value={capabilities.publicHolidayWork}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            publicHolidayWork: value,
                        }))
                    }
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>

            {/* Collaboration with other facilities */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Do you work with other hospitals or clinics?
                </label>
                <Select
                    className="h-12 w-full"
                    value={capabilities.collaboratesWithOthers}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            collaboratesWithOthers: value,
                        }))
                    }
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>

            {/* HMOs */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">Do you work with HMOs?</label>
                <Select
                    className="h-12 w-full"
                    value={capabilities.worksWithHMOs}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            worksWithHMOs: value,
                        }))
                    }
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>

            {/* NHIS/Private Insurance */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Do you accept NHIS or private health insurance?
                </label>
                <Select
                    className="h-12 w-full"
                    value={capabilities.acceptsInsurance}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            acceptsInsurance: value,
                        }))
                    }
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>

            <BranchAddresses capabilities={capabilities} setCapabilities={setCapabilities} />
            <AdditionalInfo capabilities={capabilities} setCapabilities={setCapabilities} />
        </div>
    );
};

export default SpecialistClinicForm;