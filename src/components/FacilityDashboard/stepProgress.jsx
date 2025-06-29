import React from "react";

const StepProgress = ({ currentStep = 1 }) => {
    const steps = ["Medical Specialities", "Services & Capacity", "Document Upload"];

    return (
        <div className="flex flex-col items-center w-full mt-9  px-6">
            <div className="flex w-full gap-2">
                {[1, 2, 3].map((step) => (
                    <div
                        key={step}
                        className={`flex-1 h-2 rounded ${currentStep >= step ? "bg-[#05A2C2]" : "bg-gray-300"
                            }`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default StepProgress;
