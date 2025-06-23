import React, { useState } from "react";
import Select from "react-select";
import { Info } from "lucide-react";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { Input } from "../../components/input";
import { Checkbox } from "../../components/checkbox";
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import { medicalSpecialties } from "../enums/medicalSpecialities";

export const HospitalSpecialist = ({ formData, onNext, onBack }) => {
  const [hospitalData, setHospitalData] = useState({
    type: "",
    specialties: [],
    bedSpaceBill: { paymentType: "" },
    features: [],
    admissionFee: "",
    hasLaboratory: "",
    icuBeds: "",
    wards: "",
    document: null,
  });

  const [errors, setErrors] = useState({});

  const facilityFeatures = [
    { id: "emergency", label: "Emergency Services" },
    { id: "ambulance", label: "Ambulance Services" },
    { id: "icu-availablity", label: "ICU Availability" },
    { id: "theatre", label: "Operating Theatre" },
    { id: "dialysisUnit", label: "Dialysis Unit" },
    { id: "maternityServices", label: "Maternity Services (Obs & Gyn)" },
    { id: "bloodbank", label: "Blood Bank" },
    { id: "isolation", label: "Isolation Centre" },
  ];

  const validate = () => {
    const newErrors = {};
    if (!hospitalData.type) newErrors.type = "Facility type is required";
    if (hospitalData.specialties.length === 0) newErrors.specialties = "Select at least one specialty";
    if (!hospitalData.bedSpaceBill.paymentType) newErrors.bedSpaceBill = "Bed space bill type is required";
    if (hospitalData.admissionFee === "" || isNaN(hospitalData.admissionFee) || hospitalData.admissionFee < 0)
      newErrors.admissionFee = "Admission fee must be a positive number";
    if (!hospitalData.hasLaboratory) newErrors.hasLaboratory = "Please specify if you have a laboratory";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // 🧩 Append all hospital data to FormData (use nested keys)
    formData.append("services[hospital][type]", hospitalData.type);
    formData.append("services[hospital][specialties]", JSON.stringify(hospitalData.specialties));
    formData.append("services[hospital][bedSpaceBill][paymentType]", hospitalData.bedSpaceBill.paymentType);
    formData.append("services[hospital][features]", JSON.stringify(hospitalData.features));
    formData.append("services[hospital][admissionFee]", hospitalData.admissionFee);
    formData.append("services[hospital][hasLaboratory]", hospitalData.hasLaboratory === "yes");
    formData.append("services[hospital][icuBeds]", hospitalData.icuBeds);
    formData.append("services[hospital][wards]", hospitalData.wards);

    if (hospitalData.document) {
      formData.append("hospital[document]", hospitalData.document); // match with backend fieldname
    }

    setErrors({});
    onNext(); // go to next step
  };

  return (
    <div className="flex flex-col min-h-screen items-center bg-white">
      <header className="flex w-full h-20 items-center justify-between px-20 bg-bgdefault-bg">
        <h1 className="font-bold text-primarysolid text-4xl">Logo</h1>
      </header>

      <main className="flex flex-col items-center py-10 px-4 w-full max-w-4xl">
        <div className="w-full space-y-10">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Services & Capabilities</h2>
            <p className="text-gray-600 text-sm">Ensuring accuracy for patients, regulators, and partners.</p>
          </div>

          <Card className="border border-gray-200 shadow-md w-full">
            <CardContent className="p-6 space-y-6">
              {/* Facility Type + Upload */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-800">Facility Type</label>
                  <ShadSelect onValueChange={(val) => setHospitalData((p) => ({ ...p, type: val }))}>
                    <SelectTrigger className="h-12 border-gray-300 rounded-md">
                      <SelectValue placeholder="Choose facility type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primary">Primary</SelectItem>
                      <SelectItem value="Secondary">Secondary</SelectItem>
                      <SelectItem value="Tertiary">Tertiary</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                  {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
                </div>

                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium text-gray-800">Upload Document</label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg"
                    onChange={(e) => setHospitalData((prev) => ({ ...prev, document: e.target.files[0] }))}
                    className="h-12 border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Specialties Multi-Select */}
              <div>
                <label className="text-sm font-medium text-gray-800 mb-1 block">Medical Specialties</label>
                <Select
                  options={medicalSpecialties}
                  isMulti
                  placeholder="Search and select specialties"
                  classNamePrefix="react-select"
                  className="text-sm"
                  value={medicalSpecialties.filter((spec) =>
                    hospitalData.specialties.includes(spec.value)
                  )}
                  onChange={(selectedOptions) =>
                    setHospitalData((prev) => ({
                      ...prev,
                      specialties: selectedOptions.map((opt) => opt.value),
                    }))
                  }
                />
                {errors.specialties && <p className="text-sm text-red-600 mt-1">{errors.specialties}</p>}
              </div>

              {/* Bed Space Billing */}
              <div>
                <label className="text-sm font-medium text-gray-800">Beds Space Billing</label>
                <ShadSelect
                  onValueChange={(val) =>
                    setHospitalData((p) => ({ ...p, bedSpaceBill: { paymentType: val } }))
                  }
                >
                  <SelectTrigger className="h-12 border-gray-300 rounded-md">
                    <SelectValue placeholder="Select billing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="One-time Payment">One-time Payment</SelectItem>
                  </SelectContent>
                </ShadSelect>
                {errors.bedSpaceBill && <p className="text-sm text-red-600 mt-1">{errors.bedSpaceBill}</p>}
              </div>

              {/* Features */}
              <div>
                <label className="text-sm font-medium text-gray-800">Facility Features</label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {facilityFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center gap-2">
                      <Checkbox
                        id={feature.id}
                        checked={hospitalData.features.includes(feature.id)}
                        onCheckedChange={() => {
                          const newFeatures = hospitalData.features.includes(feature.id)
                            ? hospitalData.features.filter((f) => f !== feature.id)
                            : [...hospitalData.features, feature.id];
                          setHospitalData((prev) => ({ ...prev, features: newFeatures }));
                        }}
                      />
                      <label htmlFor={feature.id} className="text-sm text-gray-700">
                        {feature.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admission Fee + Lab Availability */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-800">Admission Fee</label>
                  <Input
                    type="number"
                    placeholder="e.g. 5000"
                    value={hospitalData.admissionFee}
                    onChange={(e) =>
                      setHospitalData((prev) => ({ ...prev, admissionFee: e.target.value }))
                    }
                    className="h-12 border-gray-300 rounded-md"
                  />
                  {errors.admissionFee && <p className="text-sm text-red-600 mt-1">{errors.admissionFee}</p>}
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-800">Laboratory Available?</label>
                  <ShadSelect
                    onValueChange={(val) =>
                      setHospitalData((prev) => ({ ...prev, hasLaboratory: val }))
                    }
                  >
                    <SelectTrigger className="h-12 border-gray-300 rounded-md">
                      <SelectValue placeholder="Yes / No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                  {errors.hasLaboratory && <p className="text-sm text-red-600 mt-1">{errors.hasLaboratory}</p>}
                </div>
              </div>

              {/* ICU Beds and Wards */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-800">ICU Beds</label>
                  <Input
                    type="number"
                    placeholder="e.g. 4"
                    value={hospitalData.icuBeds}
                    onChange={(e) =>
                      setHospitalData((prev) => ({ ...prev, icuBeds: e.target.value }))
                    }
                    className="h-12 border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-800">Wards</label>
                  <Input
                    type="number"
                    placeholder="e.g. 10"
                    value={hospitalData.wards}
                    onChange={(e) =>
                      setHospitalData((prev) => ({ ...prev, wards: e.target.value }))
                    }
                    className="h-12 border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 mt-4">
            {/* <Button variant="outline" className="flex-1 h-12" onClick={onBack}>Back</Button> */}
            <Button className="flex-1 h-12 bg-primarysolid" onClick={handleSubmit}>
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
