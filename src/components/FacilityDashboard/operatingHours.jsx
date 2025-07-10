import React from 'react';
import { Input } from '../input';
import { weekDays } from './utils/initialState';
export const OperatingHours = ({ capabilities, setCapabilities, timeError, validateOperatingHours }) => {
    const handleDayToggle = (day) => {
        setCapabilities((prev) => {
            let updatedDays = [...prev.operatingDays];
            let newOpeningTime = prev.openingTime;
            let newClosingTime = prev.closingTime;

            if (day === "24/7") {
                if (updatedDays.includes("24/7")) {
                    updatedDays = [];
                    newOpeningTime = "";
                    newClosingTime = "";
                } else {
                    updatedDays = weekDays.filter((d) => d !== "24/7").concat("24/7");
                    newOpeningTime = "00:00";
                    newClosingTime = "23:59";
                }
            } else {
                if (updatedDays.includes(day)) {
                    updatedDays = updatedDays.filter((d) => d !== day && d !== "24/7");
                } else {
                    updatedDays = [...updatedDays, day].filter((d) => d !== "24/7");
                }
                if (updatedDays.includes("24/7")) {
                    updatedDays = updatedDays.filter((d) => d !== "24/7");
                    newOpeningTime = "";
                    newClosingTime = "";
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

            {!capabilities.operatingDays.includes("24/7") && (
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

            {timeError && !capabilities.operatingDays.includes("24/7") && (
                <p className="text-red-500 text-sm">{timeError}</p>
            )}

            {timeError && <p className="text-red-500 text-sm">{timeError}</p>}
        </>
    );
};
