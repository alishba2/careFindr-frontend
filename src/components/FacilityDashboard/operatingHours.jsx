import React, { useEffect } from 'react';
import { Input } from '../input';
import { weekDays } from './utils/initialState';

export const OperatingHours = ({ capabilities, setCapabilities, timeError, validateOperatingHours }) => {


    useEffect(()=>{

        console.log(capabilities, "capabilities are here");

    },[capabilities])

    const handleDayToggle = (day) => {
        setCapabilities((prev) => {
            let updatedDays = [...prev.operatingDays];
            let newOpeningTime = prev.openingTime;
            let newClosingTime = prev.closingTime;

            if (day === "24/7") {
                if (updatedDays.includes("24/7")) {
                    // Deselect 24/7 and all days
                    updatedDays = [];
                    newOpeningTime = "";
                    newClosingTime = "";
                } else {
                    // Select 24/7 and all days - explicitly include 24/7
                    updatedDays = ["24/7", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                    newOpeningTime = "00:00";
                    newClosingTime = "23:59";
                }
            } else {
                if (updatedDays.includes(day)) {
                    // Deselecting a day - remove it and 24/7
                    updatedDays = updatedDays.filter((d) => d !== day && d !== "24/7");
                } else {
                    // Selecting a day - add it but remove 24/7
                    updatedDays = [...updatedDays.filter((d) => d !== "24/7"), day];
                }
                
                // Check if all individual days are selected (excluding 24/7)
                const individualDays = weekDays.filter(d => d !== "24/7");
                const selectedIndividualDays = updatedDays.filter(d => d !== "24/7");
                
                if (selectedIndividualDays.length === individualDays.length) {
                    // All individual days are selected, so add 24/7 and keep all days
                    updatedDays = ["24/7", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                    newOpeningTime = "00:00";
                    newClosingTime = "23:59";
                } else {
                    // Not all days selected, clear times if no days selected
                    if (updatedDays.length === 0) {
                        newOpeningTime = "";
                        newClosingTime = "";
                    }
                }
            }

            return {
                ...prev,
                operatingDays: updatedDays,
                openingTime: newOpeningTime,
                closingTime: newClosingTime,
            };
        });
    };

    const handleTimeChange = (field, value) => {
        setCapabilities((prev) => ({
            ...prev,
            [field]: value,
        }));
        validateOperatingHours();
    };

    // Define the missing variables
    const individualDays = weekDays.filter(d => d !== "24/7");
    const selectedIndividualDays = capabilities.operatingDays.filter(d => d !== "24/7");
    const hasAllIndividualDays = selectedIndividualDays.length === individualDays.length;
    const is24_7Selected = capabilities.operatingDays.includes("24/7");

    // Auto-select 24/7 if all individual days are present but 24/7 isn't
    React.useEffect(() => {
        if (hasAllIndividualDays && !capabilities.operatingDays.includes("24/7")) {
            setCapabilities(prev => ({
                ...prev,
                operatingDays: ["24/7", ...prev.operatingDays],
                openingTime: "00:00",
                closingTime: "23:59"
            }));
        }
    }, [hasAllIndividualDays, capabilities.operatingDays, setCapabilities]);

    return (
        <>
            <div className="space-y-2">
                <h1 className="text-sm font-bold text-gray-900 mb-2">Weekly Operating Days</h1>
                <div className="flex flex-wrap gap-4">
                    {weekDays.map((day) => (
                        <label key={day} className="text-sm text-gray-700 flex items-center gap-2">
                            <input
                                type="checkbox"
                                value={day}
                                checked={capabilities.operatingDays.includes(day)}
                                onChange={() => handleDayToggle(day)}
                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                            />
                            {day}
                        </label>
                    ))}
                </div>
            </div>

            {!is24_7Selected && (
                <div className="flex gap-4 md:flex-row flex-col">
                    <div className="flex-1 md:w-auto w-full">
                        <label className="text-sm font-bold text-gray-800">Opening Time</label>
                        <Input
                            type="time"
                            className="h-12 border-gray-300 rounded-md"
                            value={capabilities.openingTime}
                            onChange={(e) => handleTimeChange("openingTime", e.target.value)}
                        />
                    </div>
                    <div className="flex-1 md:w-auto w-full">
                        <label className="text-sm font-bold text-gray-800">Closing Time</label>
                        <Input
                            type="time"
                            className="h-12 border-gray-300 rounded-md"
                            value={capabilities.closingTime}
                            onChange={(e) => handleTimeChange("closingTime", e.target.value)}
                        />
                    </div>
                </div>
            )}

            {timeError && !is24_7Selected && (
                <p className="text-red-500 text-sm">{timeError}</p>
            )}
        </>
    );
};