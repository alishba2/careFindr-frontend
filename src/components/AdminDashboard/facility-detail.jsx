import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Info, UploadIcon } from "lucide-react";
import Select from "react-select";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { Input } from "../../components/input";
import { Checkbox } from "../../components/checkbox";
import { Label } from "../../components/label";
import { Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/select";
import { Textarea } from "../../components/textArea";
import { getFacilityById } from "../../services/facility";
import { CoreClinicalSpecialities } from "../enums/medicalSpecialities";
import { useAuth } from "../hook/auth";
import { updateFacilityServices } from "../../services/facility";
import { FacilityInformation } from "../FacilityDashboard/facilityInformation";

import { HospitalServices } from "../FacilityDashboard/hospitalServices";
import { FacilityDoc } from "./facilitydocs";
const FacilityDetail = () => {
  const { id } = useParams();
  const { authData } = useAuth();
  const [facility, setFacility] = useState(null);
  const [isEditing, setIsEditing] = useState(false);



  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const response = await getFacilityById(id);
        console.log(response, "response is here");
        setFacility(response);

      } catch (err) {
        console.error("Failed to fetch facility details", err);
      }
    };
    fetchFacility();
  }, [id]);


  if (!facility) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-10xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">{facility.name}</h2>
        <Button
          className="h-12 px-6 bg-primarysolid text-white rounded-md"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      <FacilityInformation />


      <HospitalServices />

      <FacilityDoc facilityId={id}/>


    </div>
  );
};

export default FacilityDetail;