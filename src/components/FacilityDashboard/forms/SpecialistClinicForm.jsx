import React, { useEffect } from 'react';
import { Select, Spin } from 'antd';
import { Input } from '../../input';
import TextArea from "antd/es/input/TextArea";
import { OperatingHours } from '../operatingHours';
import { BranchAddresses } from '../BranchAddresses';
import { AdditionalInfo } from '../AdditionalInfo';
import NumericInput from '../NumericInput';
const { Option } = Select;

const SpecialistClinicForm = ({ capabilities, setCapabilities, timeError, validateOperatingHours, loading }) => {

    useEffect(() => {

        console.log(capabilities, "capabilities");

    }, [capabilities])
    return (
        <>
          {
            loading?(
                    <div className = "flex items-center justify-center py-10 " >
                    <Spin tip="Loading..." size="large" />
                                </div >
            ): (
                        <div className="space-y-4 sm:space-y-6 p-2 sm:p-0 mt-14 md:mt-0">
        {/* Core and Specialized Services */}
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800">
                What are the core and specialized medical services or procedures you provide? <span className="text-red-600">*</span>
            </label>
            <TextArea
                rows={4}
                className="border-gray-300 rounded-md"
                value={capabilities.coreServices}
                onChange={(e) =>
                    setCapabilities((prev) => ({
                        ...prev,
                        coreServices: e.target.value,
                    }))
                }
                placeholder="e.g., Dialysis, Fertility Treatment, Cardiology, Dermatology, Orthopedics"
            />
        </div>

        {/* Row 1: Care Type + On-Site Doctor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Type of Care Offered <span className="text-red-600">*</span>
                </label>
                <Select
                    className="h-12 w-full"
                    style={{ height: "48px" }}
                    value={capabilities.careType}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            careType: value,
                        }))
                    }
                    placeholder="Select care type"
                >
                    <Option value="">Select</Option>
                    <Option value="Inpatient">Inpatient</Option>
                    <Option value="Outpatient">Outpatient</Option>
                    <Option value="Both">Both</Option>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Doctor/Specialist Always On-Site <span className="text-red-600">*</span>
                </label>
                <Select
                    className="h-12 w-full"
                    style={{ height: "48px" }}
                    value={capabilities.onSiteDoctor}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            onSiteDoctor: value,
                        }))
                    }
                    placeholder="Select availability"
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>
        </div>

        {/* Row 2: Emergency Response + Critical Care */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Emergency Response Plan
                </label>
                <Select
                    className="h-12 w-full"
                    style={{ height: "48px" }}
                    value={capabilities.emergencyResponsePlan}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            emergencyResponsePlan: value,
                        }))
                    }
                    placeholder="Do you have emergency protocols?"
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Critical Care Equipment
                </label>
                <Select
                    className="h-12 w-full"
                    style={{ height: "48px" }}
                    value={capabilities.criticalCare}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            criticalCare: value,
                        }))
                    }
                    placeholder="Are you equipped for critical care?"
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>
        </div>

        {/* Multidisciplinary Care */}
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800">
                Multidisciplinary Care Team
            </label>
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
                placeholder="e.g., Dieticians, Mental Health Specialists, Physiotherapists, Social Workers"
            />
        </div>

        {/* Row 3: Bed Capacity + Patient Limit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Bed Capacity (if applicable)
                </label>
                <NumericInput
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
                    min="0"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Daily Patient Limit
                </label>
                <NumericInput
                    type="text"
                    className="h-12 border-gray-300 rounded-md"
                    value={capabilities.patientLimit}
                    onChange={(e) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            patientLimit: e.target.value,
                        }))
                    }
                    placeholder="e.g., 50 patients per day"
                />
            </div>
        </div>

        {/* Row 4: Home Services + Online Booking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Home Services / Mobile Health
                </label>
                <Select
                    className="h-12 w-full"
                    style={{ height: "48px" }}
                    value={capabilities.homeServices}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            homeServices: value,
                        }))
                    }
                    placeholder="Do you offer home visits?"
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Online Booking System
                </label>
                <Select
                    className="h-12 w-full"
                    style={{ height: "48px" }}
                    value={capabilities.onlineBooking}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            onlineBooking: value,
                        }))
                    }
                    placeholder="Do you support online booking?"
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>
        </div>

        {/* Operating Hours Component */}
        <OperatingHours
            capabilities={capabilities}
            setCapabilities={setCapabilities}
            timeError={timeError}
            validateOperatingHours={validateOperatingHours}
        />

        {/* Row 5: Public Holiday + Collaboration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Public Holiday Operations
                </label>
                <Select
                    className="h-12 w-full"
                    style={{ height: "48px" }}
                    value={capabilities.publicHolidayWork}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            publicHolidayWork: value,
                        }))
                    }
                    placeholder="Do you operate on public holidays?"
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Hospital/Clinic Partnerships
                </label>
                <Select
                    className="h-12 w-full"
                    style={{ height: "48px" }}
                    value={capabilities.collaboratesWithOthers}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            collaboratesWithOthers: value,
                        }))
                    }
                    placeholder="Do you partner with other facilities?"
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>
        </div>

        {/* Row 6: HMOs + Insurance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    HMO Partnerships
                </label>
                <Select
                    className="h-12 w-full"
                    style={{ height: "48px" }}
                    value={capabilities.worksWithHMOs}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            worksWithHMOs: value,
                        }))
                    }
                    placeholder="Do you work with HMOs?"
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    Insurance Acceptance
                </label>
                <Select
                    className="h-12 w-full"
                    style={{ height: "48px" }}
                    value={capabilities.acceptsInsurance}
                    onChange={(value) =>
                        setCapabilities((prev) => ({
                            ...prev,
                            acceptsInsurance: value,
                        }))
                    }
                    placeholder="Do you accept health insurance?"
                >
                    <Option value="">Select</Option>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                </Select>
            </div>
        </div>

        <BranchAddresses capabilities={capabilities} setCapabilities={setCapabilities} />
        <AdditionalInfo capabilities={capabilities} setCapabilities={setCapabilities} />
    </div>
)
        }
        </>
      
     
    );
};

export default SpecialistClinicForm;