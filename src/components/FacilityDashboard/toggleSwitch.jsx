import React from 'react';

export const ToggleSwitch = ({ isOn, onToggle }) => (
    <div
        className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors duration-300 ${
            isOn ? "bg-primarysolid" : "bg-gray-300"
        }`}
        onClick={onToggle}
    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                isOn ? "translate-x-6" : "translate-x-1"
            }`}
        />
    </div>
);