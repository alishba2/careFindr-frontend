import React from 'react';
import { Input } from '../input';
import { Button } from '../button';
import { Select } from 'antd';

const { Option } = Select;

export const BranchAddresses = ({ capabilities, setCapabilities }) => {
    const addBranchAddress = () => {
        setCapabilities((prev) => ({
            ...prev,
            branchAddresses: [...prev.branchAddresses, ""],
        }));
    };

    const updateBranchAddress = (index, value) => {
        setCapabilities((prev) => {
            const updatedAddresses = [...prev.branchAddresses];
            updatedAddresses[index] = value;
            return { ...prev, branchAddresses: updatedAddresses };
        });
    };

    const deleteBranchAddress = (index) => {
        setCapabilities((prev) => {
            const updatedAddresses = prev.branchAddresses.filter((_, i) => i !== index);
            return { ...prev, branchAddresses: updatedAddresses };
        });
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800">Do you have other Branches?</label>
            <Select
                className="h-12 w-full"
                style={{ height: "48px" }}
                value={capabilities.hasOtherBranches}
                onChange={(value) =>
                    setCapabilities((prev) => ({
                        ...prev,
                        hasOtherBranches: value,
                        branchAddresses: value === "Yes" ? prev.branchAddresses : [""],
                    }))
                }
            >
                <Option value="">Select</Option>
                <Option value="No">No</Option>
                <Option value="Yes">Yes</Option>
            </Select>
            
            {capabilities.hasOtherBranches === "Yes" && (
                <div className="space-y-4 mt-4">
                    <label className="text-sm font-bold text-gray-800">
                        Branch Full Address (Specify the floor if the building has multiple levels)
                    </label>
                    {capabilities.branchAddresses.map((address, index) => (
                        <div key={index} className="flex gap-4 items-center">
                            <Input
                                type="text"
                                className="h-12 border-gray-300 rounded-md flex-1"
                                value={address}
                                onChange={(e) => updateBranchAddress(index, e.target.value)}
                                placeholder={`Branch ${index + 1} Address`}
                            />
                            <Button
                                className="h-12 px-4 bg-red-500 text-white rounded-md"
                                onClick={() => deleteBranchAddress(index)}
                                disabled={capabilities.branchAddresses.length === 1}
                            >
                                Delete
                            </Button>
                        </div>
                    ))}
                    <Button
                        className="h-10 px-4 bg-primarysolid text-white rounded-md"
                        onClick={addBranchAddress}
                    >
                        + Add another branch
                    </Button>
                </div>
            )}
        </div>
    );
};