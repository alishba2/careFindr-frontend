import { useState } from "react";

export const Subspecialties = () => {
  const [activeTab, setActiveTab] = useState("Cardiovascular & Respiratory");
  const [toggleStates, setToggleStates] = useState({
    Cardiology: true,
    Pulmonology: true,
    "Thoracic Surgery": true,
    Neurology: false,
    Neurosurgery: false,
    Psychiatry: false,
    Endocrinology: false,
    "Diabetes & Metabolism": false,
    "Thyroid Disorders": false,
    Gastroenterology: false,
    "Hepatology": false,
    "Colorectal Surgery": false,
    Hematology: false,
    Immunology: false,
    "Infectious Diseases": false,
    Dermatology: false,
    Ophthalmology: false,
    "ENT Surgery": false,
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
    "Bones & Muscles"
  ];

  const specialtyData = {
    "Cardiovascular & Respiratory": [
      "Cardiology",
      "Pulmonology", 
      "Thoracic Surgery"
    ],
    "Brain & Nervous system": [
      "Neurology",
      "Neurosurgery",
      "Psychiatry"
    ],
     "Bones & Muscles" : [
         "Orthopedic Surgery",
         "Rheumatology",
     ],
    "Endocrine, Metabolism": [
      "Endocrinology",
      "Diabetes & Metabolism",
      "Thyroid Disorders"
    ],
    "Digestive System": [
      "Gastroenterology",
      "Hepatology",
    ],
    "Immune & Blood": [
      "Hematology",
      "Immunology",
      "Infectious Diseases"
    ],
    "Sensory, Skin & Others": [
      "Dermatology",
      "Ophthalmology",
      "Otolaryngology",
      "Plastic Surgery",
      "Dentistry ",
      "Pathology",
      "Radiology",
      "Nuclear Medicine",
      "Physical Medicine & Rehabilitation",
      "Pain Medicine",

    ],
     "Pediatric Subspecialties": [
       "Pediatric Cardiology",
       "Pediatric Neurology",
       "Pediatric Surgery"
     ],
     "Public Health and Administrative": [
       "Public Health",
       "Health Administration",
       "Occupational Medicine",
       "Preventive Medicine",
       "Medical Genetics",
       "Geriatrics",
       "Forensic Medicine",
       "Health Policy",
     ]
  };

  const handleToggle = (specialty) => {
    setToggleStates(prev => ({
      ...prev,
      [specialty]: !prev[specialty]
    }));
  };

 const ToggleSwitch = ({ isOn, onToggle }) => {
    return (
      <div
        className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors duration-300 ${
          isOn ? 'bg-cyan-500' : 'bg-gray-300'
        }`}
        onClick={onToggle}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>
    );
  };

  // Check if current tab needs flex-wrap layout (3 items per row)
  const needsFlexWrap = activeTab === "Public Health and Administrative" || activeTab === "Sensory, Skin & Others";

  return (
    <div className="max-w-6xl mx-auto p-1 bg-white">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Subspecialties and Fields of Medicine
      </h1>
      
      {/* Tab Navigation */}
      <div className="flex  flex-wrap  gap-2 mb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3  rounded-lg text-sm  font-bold transition-colors duration-200 ${
              activeTab === tab
                ? 'bg-[#05A2C2] text-white'
                : ' text-[#05A2C2] hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div>
        <div className={needsFlexWrap ? "flex flex-wrap gap-6" : "flex gap-44 text-base"}>
          {specialtyData[activeTab]?.map((specialty) => (
            <div 
              key={specialty} 
              className={`flex items-center justify-between ${
                needsFlexWrap 
                  ? "w-80 gap-4 mb-4" 
                  : "gap-10"
              }`}
            >
              <span className="text-gray-900 font-small">{specialty}</span>
              <ToggleSwitch
                isOn={toggleStates[specialty]}
                onToggle={() => handleToggle(specialty)}
              />
            </div>
          ))}
        </div>
        
        {!specialtyData[activeTab]?.length && (
          <div className="text-center text-gray-500 py-12">
            No specialties available for this category
          </div>
        )}
      </div>
    </div>
  );
};

export default Subspecialties;