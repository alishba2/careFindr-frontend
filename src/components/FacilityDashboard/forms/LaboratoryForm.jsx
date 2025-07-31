import React from 'react';
import { Select, Spin } from 'antd';
import { OperatingHours } from '../operatingHours';
import { BranchAddresses } from '../BranchAddresses';
import { AdditionalInfo } from '../AdditionalInfo';

const { Option } = Select;

const LaboratoryForm = ({ capabilities, setCapabilities, timeError, validateOperatingHours, loading }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-10">
                <Spin tip="Loading..." size="large" />
            </div>
        );
    }

    return (
        <>
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-0 mt-14 md:mt-0">
                <div className="flex-1 min-w-0">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-800">Accreditation Status</label>
                        <Select
                            className="h-12 w-full"
                            style={{ height: "48px" }}
                            value={capabilities.accreditationStatus}
                            onChange={(value) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    accreditationStatus: value,
                                }))
                            }
                        >
                            <Option value="">Select</Option>
                            <Option value="Approved">Approved</Option>
                            <Option value="Rejected">Rejected</Option>
                        </Select>
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-800">Home Sample Collection</label>
                        <Select
                            className="h-12 w-full"
                            style={{ height: "48px" }}
                            value={capabilities.homeSampleCollection}
                            onChange={(value) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    homeSampleCollection: value,
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

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
                <div className="sm:w-full">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800">Do you offer COVID-19 testing?</label>
                        <Select
                            className="h-12 w-full"
                            style={{ height: "48px" }}
                            value={capabilities.offersCovidTesting}
                            onChange={(value) =>
                                setCapabilities((prev) => ({
                                    ...prev,
                                    offersCovidTesting: value,
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

export default LaboratoryForm;
