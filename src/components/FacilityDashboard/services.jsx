import React from "react";
import { HospitalServices } from "./hospitalServices";


// import LabServices from "./labServices";
// import PharmacyServices from "./pharmacyServices";
// import AmbulanceServices from "./ambulanceServices";

export default function Services() {

  return (
    <div>
      { <HospitalServices />}
      {/* {facilityType === "laboratory" && <LabServices />}
      {facilityType === "pharmacy" && <PharmacyServices />}
      {facilityType === "ambulance" && <AmbulanceServices />} */}
    </div>
  );
}
