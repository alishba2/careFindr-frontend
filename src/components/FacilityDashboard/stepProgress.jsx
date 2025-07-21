import React, {useState, useEffect} from "react";
import { getProfileStatus } from "../../services/facility";

const StepProgress = () => {
    const steps = ["Facility Information", "Services & Capacity", "Document Upload"];
    const [completionStatus, setCompletionStatus] = useState({
        isProfileComplete: false,
        isServiceComplete: false,
        isDocumentComplete: false
    });
    const [currentStep, setCurrentStep] = useState(0);
    const [totalPoints, setTotalPoints] = useState(20);

    useEffect(() => {
        const fetchProfileStatus = async () => {
            try {
                const res = await getProfileStatus();
                console.log(res, "profile status is here");
                
                const status = {
                    isProfileComplete: true || false,
                    isServiceComplete: res?.isServiceComplete || false,
                    isDocumentComplete: res?.isDocumentComplete || false
                };
                
                setCompletionStatus(status);
                setTotalPoints(res?.totalPoints || 20);
                
                // Calculate current step based on completion
                // Step 1: Profile (Medical Specialities)
                // Step 2: Services (Services & Capacity) 
                // Step 3: Documents (Document Upload)
                let step = 0;
                if (status.isProfileComplete) step = 1;
                if (status.isServiceComplete) step = 2;
                if (status.isDocumentComplete) step = 3;
                
                setCurrentStep(step);
            } catch (error) {
                console.error("Error fetching profile status:", error);
            }
        };
        
        fetchProfileStatus();
    }, []);

    // Map steps to their completion status
    const getStepCompletion = (stepIndex) => {
        switch (stepIndex) {
            case 0: return completionStatus.isProfileComplete; // Medical Specialities
            case 1: return completionStatus.isServiceComplete; // Services & Capacity
            case 2: return completionStatus.isDocumentComplete; // Document Upload
            default: return false;
        }
    };

    return (
        <div className="flex flex-col items-center w-full mt-9 px-6">
            {/* Progress Bar */}
            <div className="flex w-full gap-2 mb-4">
                {steps.map((_, index) => (
                    <div
                        key={index}
                        className={`flex-1 h-2 rounded transition-colors duration-300 ${
                            getStepCompletion(index) 
                                ? "bg-[#359DF4]" 
                                : "bg-gray-300"
                        }`}
                    ></div>
                ))}
            </div>
            
            {/* Step Labels */}
            <div className="flex w-full justify-between text-sm text-gray-600">
                {steps.map((step, index) => (
                    <span 
                        key={index}
                        className={`text-center ${
                            getStepCompletion(index) 
                                ? "text-[#359DF4] font-medium" 
                                : "text-gray-500"
                        }`}
                    >
                        {/* {step} */}
                    </span>
                ))}
            </div>
            
           
        </div>
    );
};

export default StepProgress;