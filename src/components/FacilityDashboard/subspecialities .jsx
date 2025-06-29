import { useState, useEffect } from "react";

export const Subspecialties = ({ subSpecialities, setSubspecialities }) => {
  const [activeTab, setActiveTab] = useState("Cardiovascular & Respiratory");
  const [toggleStates, setToggleStates] = useState({
    Cardiology: false,
    Pulmonology: false,
    "Thoracic Surgery": false,
    Neurology: false,
    Neurosurgery: false,
    Psychiatry: false,
    Endocrinology: false,
    "Diabetes & Metabolism": false,
    "Thyroid Disorders": false,
    Gastroenterology: false,
    Hepatology: false,
    Hematology: false,
    Immunology: false,
    "Infectious Diseases": false,
    Dermatology: false,
    Ophthalmology: false,
    Otolaryngology: false,
    "Plastic Surgery": false,
    Dentistry: false,
    Pathology: false,
    Radiology: false,
    "Nuclear Medicine": false,
    "Physical Medicine & Rehabilitation": false,
    "Pain Medicine": false,
    "Pediatric Cardiology": false,
    "Pediatric Neurology": false,
    "Pediatric Surgery": false,
    "Public Health": false,
    "Health Administration": false,
    "Occupational Medicine": false,
    "Preventive Medicine": false,
    "Medical Genetics": false,
    "Geriatrics": false,
    "Forensic Medicine": false,
    "Health Policy": false,
    "Orthopedic Surgery": false,
    Rheumatology: false,
  });

  const tabs = [
    "Cardiovascular & Respiratory",
    "Brain & Nervous system",
    "Endocrine, Metabolism",
    "Digestive System",
    "Immune & Blood",
    "Sensory, Skin & Others",
    "Pediatric Subspecialties",
    "Public Health and Administrative",
    "Bones & Muscles",
  ];

  const specialtyData = {
    "Cardiovascular & Respiratory": ["Cardiology", "Pulmonology", "Thoracic Surgery"],
    "Brain & Nervous system": ["Neurology", "Neurosurgery", "Psychiatry"],
    "Bones & Muscles": ["Orthopedic Surgery", "Rheumatology"],
    "Endocrine, Metabolism": ["Endocrinology", "Diabetes & Metabolism", "Thyroid Disorders"],
    "Digestive System": ["Gastroenterology", "Hepatology"],
    "Immune & Blood": ["Hematology", "Immunology", "Infectious Diseases"],
    "Sensory, Skin & Others": [
      "Dermatology",
      "Ophthalmology",
      "Otolaryngology",
      "Plastic Surgery",
      "Dentistry",
      "Pathology",
      "Radiology",
      "Nuclear Medicine",
      "Physical Medicine & Rehabilitation",
      "Pain Medicine",
    ],
    "Pediatric Subspecialties": ["Pediatric Cardiology", "Pediatric Neurology", "Pediatric Surgery"],
    "Public Health and Administrative": [
      "Public Health",
      "Health Administration",
      "Occupational Medicine",
      "Preventive Medicine",
      "Medical Genetics",
      "Geriatrics",
      "Forensic Medicine",
      "Health Policy",
    ],
  };

  // Synchronize toggleStates with subSpecialities prop
  useEffect(() => {
    const newToggleStates = { ...toggleStates };
    Object.keys(newToggleStates).forEach((specialty) => {
      newToggleStates[specialty] = subSpecialities?.includes(specialty);
    });
    setToggleStates(newToggleStates);
  }, [subSpecialities]);

  const handleToggle = (specialty) => {
    setToggleStates((prev) => {
      const newState = {
        ...prev,
        [specialty]: !prev[specialty],
      };

      // Update setSubspecialities with the list of selected subspecialties
      const selectedSubspecialties = Object.keys(newState).filter((key) => newState[key]);
      setSubspecialities(selectedSubspecialties);

      return newState;
    });
  };

  const ToggleSwitch = ({ isOn, onToggle }) => (
    <div
      className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors duration-300 ${
        isOn ? "bg-cyan-500" : "bg-gray-300"
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

  return (
    <div className="w-full mx-auto p-1 bg-white">
      <h1 className="text-lg font-semibold text-gray-900 mb-4">
        Subspecialties and Fields of Medicine
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === tab ? "bg-[#05A2C2] text-white" : "text-[#05A2C2] hover:bg-[#e6f9fd]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid of specialties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialtyData[activeTab]?.map((specialty) => (
          <div
            key={specialty}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <span className="text-gray-800 text-sm">{specialty}</span>
            <ToggleSwitch
              isOn={toggleStates[specialty]}
              onToggle={() => handleToggle(specialty)}
            />
          </div>
        ))}
      </div>

      {/* Empty fallback */}
      {!specialtyData[activeTab]?.length && (
        <div className="text-center text-gray-500 py-12">
          No specialties available for this category.
        </div>
      )}
    </div>
  );
};

export default Subspecialties;