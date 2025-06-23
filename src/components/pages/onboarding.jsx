import React, { useState, useEffect } from "react";
import { HospitalSpecialist } from "../onBoardingScreens.jsx/hospitalSpecialistClinic";
import { AmbulanceIs } from "../onBoardingScreens.jsx/ambulanceService";
import { LaboratoryIs } from "../onBoardingScreens.jsx/laboratory";
import { PharmacyIsSelected } from "../onBoardingScreens.jsx/pharmacyService";
import { FacilityCapabilities } from "../onBoardingScreens.jsx/facilityCapabilities.jsx";

import { updateFacilityServices } from "../../services/facility.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Onboarding = () => {
  const [facility, setFacility] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [finish, setFinish] = useState(false);
  const [hasLaboratory, setHasLaboratory] = useState(false); // track lab inclusion
  const [formData] = useState(new FormData()); // Shared FormData
  const navigate = useNavigate();

  useEffect(() => {
    const storedFacility = localStorage.getItem("facilityType");
    if (storedFacility) {
      setFacility(storedFacility);
    }
  }, []);

  useEffect(() => {
    if (facility) {
      localStorage.setItem("facilityType", facility);
    }
  }, [facility]);

  // Navigation Handlers
  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };
 
  // Final submission
  useEffect(() => {
    if (finish) {
      alert("Onboarding completed successfully!");

      const updateServices = async () => {
        try {
          const response = await updateFacilityServices(formData);
          console.log("Services updated successfully:", response);
          toast.success("Onboarding completed successfully!");
          navigate("/facility-dashboard");
        } catch (error) {
          console.error("Error updating services:", error);
          toast.error("Failed to complete onboarding. Please try again.");
        }
      };

      updateServices();
    }
  }, [finish]);

  // Dynamic step rendering based on facility
  const getSteps = () => {
    const steps = [];

    if (facility === "hospital" || facility === "clinic") {
      steps.push(
        <HospitalSpecialist
          formData={formData}
          onNext={(hasLab = false) => {
            if (hasLab) setHasLaboratory(true);
            handleNextStep();
          }}
          onBack={handlePrevStep}
        />
      );

      // Conditionally push Laboratory step if it's hospital & hasLaboratory true
      if (facility === "hospital" && hasLaboratory) {
        steps.push(
          <LaboratoryIs
            formData={formData}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        );
      }
    }

    if (facility === "ambulance") {
      steps.push(
        <AmbulanceIs
          formData={formData}
          onNext={handleNextStep}
          onBack={handlePrevStep}
        />
      );
    }

    if (facility === "laboratory") {
      steps.push(
        <LaboratoryIs
          formData={formData}
          onNext={handleNextStep}
          onBack={handlePrevStep}
        />
      );
    }

    if (facility === "pharmacy") {
      steps.push(
        <PharmacyIsSelected
          formData={formData}
          onNext={handleNextStep}
          onBack={handlePrevStep}
        />
      );
    }

    // Always add capabilities step at the end
    steps.push(
      <FacilityCapabilities
        formData={formData}
        onNext={handleNextStep}
        onBack={handlePrevStep}
        setFinish={setFinish}
      />
    );

    return steps;
  };

  const steps = getSteps();

  return <main>{steps[currentStep] || <div>Invalid Step</div>}</main>;
};

export default Onboarding;
