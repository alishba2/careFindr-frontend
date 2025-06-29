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

const FacilityDetail = () => {
  const { id } = useParams();
  const { authData } = useAuth();
  const [facility, setFacility] = useState(null);
  const [hospitalData, setHospitalData] = useState({});
  const [laboratoryData, setLaboratoryData] = useState({});
  const [pharmacyData, setPharmacyData] = useState({});
  const [ambulanceData, setAmbulanceData] = useState({});
  const [capabilities, setCapabilities] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Sample data for checkboxes (aligned with EditServices)
  const ambulanceTypes = [
    { id: "basic", label: "Basic Life Support" },
    { id: "advanced", label: "Advanced Life Support" },
    { id: "criticalCare", label: "Critical Care" },
  ];
  const equipmentChecklist = [
    { id: "defibrillator", label: "Defibrillator" },
    { id: "oxygen", label: "Oxygen Tank" },
    { id: "stretchers", label: "Stretchers" },
  ];
  const crewTypes = [
    { id: "paramedic", label: "Paramedic" },
    { id: "driver", label: "Driver" },
    { id: "nurse", label: "Nurse" },
  ];
  const paymentMethods = [
    { id: "cash", label: "Cash" },
    { id: "card", label: "Card" },
    { id: "mobile", label: "Mobile Payment" },
  ];
  const facilityFeatures = [
    { id: "emergency", label: "Emergency Services" },
    { id: "ambulance", label: "Ambulance Services" },
    { id: "icu-availability", label: "ICU Availability" },
    { id: "theatre", label: "Operating Theatre" },
    { id: "dialysisUnit", label: "Dialysis Unit" },
    { id: "maternityServices", label: "Maternity Services (Obs & Gyn)" },
    { id: "bloodbank", label: "Blood Bank" },
    { id: "isolation", label: "Isolation Centre" },
  ];
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const response = await getFacilityById(id);
        setFacility(response);
        setHospitalData(response.services?.hospital || {});
        setLaboratoryData(response.services?.laboratory || {});
        setPharmacyData(response.services?.pharmacy || {});
        setAmbulanceData(response.services?.ambulance || {});
        setCapabilities(response.services?.capabilities || {});
      } catch (err) {
        console.error("Failed to fetch facility details", err);
      }
    };
    fetchFacility();
  }, [id]);

  const handleFeatureChange = (id) => {
    const updated = hospitalData.features?.includes(id)
      ? hospitalData.features.filter((f) => f !== id)
      : [...(hospitalData.features || []), id];
    setHospitalData({ ...hospitalData, features: updated });
  };

  const handleAmbulanceCheckboxChange = (field, id, checked) => {
    setAmbulanceData((prev) => {
      const current = prev[field] || [];
      return {
        ...prev,
        [field]: checked ? [...current, id] : current.filter((item) => item !== id),
      };
    });
  };

  const handleFileChange = (field, e, setter) => {
    const file = e.target.files[0];
    setter((prev) => ({ ...prev, [field]: file }));
  };

  const handleSave = async () => {
    try {
      const updatedFacility = {
        ...facility,
        services: {
          hospital: hospitalData,
          laboratory: laboratoryData,
          pharmacy: pharmacyData,
          ambulance: ambulanceData,
          capabilities,
        },
      };
      await updateFacilityServices(id, updatedFacility);
      setFacility(updatedFacility);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update facility", err);
    }
  };

  if (!facility) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-10xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">{facility.name}</h2>
        <Button
          className="h-12 px-6 bg-primarysolid text-white rounded-md"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {/* General Facility Information */}
      <Card className="border border-gray-200 shadow">
        <CardContent className="p-6 space-y-6">
          <h3 className="text-xl font-semibold text-gray-700">General Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-800">Name</Label>
              {isEditing ? (
                <Input
                  className="h-12 border-gray-300 rounded-md"
                  value={facility.name || ""}
                  onChange={(e) => setFacility((prev) => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <p className="text-sm text-gray-700">{facility.name}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800">Type</Label>
              {isEditing ? (
                <ShadSelect
                  value={facility.type}
                  onValueChange={(val) => setFacility((prev) => ({ ...prev, type: val }))}
                >
                  <SelectTrigger className="h-12 border-gray-300 rounded-md">
                    <SelectValue placeholder="Choose facility type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hospital">Hospital</SelectItem>
                    <SelectItem value="Clinic">Clinic</SelectItem>
                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                    <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                  </SelectContent>
                </ShadSelect>
              ) : (
                <p className="text-sm text-gray-700">{facility.type}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800">Status</Label>
              {isEditing ? (
                <ShadSelect
                  value={facility.status}
                  onValueChange={(val) => setFacility((prev) => ({ ...prev, status: val }))}
                >
                  <SelectTrigger className="h-12 border-gray-300 rounded-md">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </ShadSelect>
              ) : (
                <p className="text-sm text-gray-700">{facility.status}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800">State</Label>
              {isEditing ? (
                <Input
                  className="h-12 border-gray-300 rounded-md"
                  value={facility.state || ""}
                  onChange={(e) => setFacility((prev) => ({ ...prev, state: e.target.value }))}
                />
              ) : (
                <p className="text-sm text-gray-700">{facility.state}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800">LGA</Label>
              {isEditing ? (
                <Input
                  className="h-12 border-gray-300 rounded-md"
                  value={facility.lga || ""}
                  onChange={(e) => setFacility((prev) => ({ ...prev, lga: e.target.value }))}
                />
              ) : (
                <p className="text-sm text-gray-700">{facility.lga}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800">Phone</Label>
              {isEditing ? (
                <Input
                  type="tel"
                  className="h-12 border-gray-300 rounded-md"
                  value={facility.phone || ""}
                  onChange={(e) => setFacility((prev) => ({ ...prev, phone: e.target.value }))}
                />
              ) : (
                <p className="text-sm text-gray-700">{facility.phone}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800">Secondary Phone</Label>
              {isEditing ? (
                <Input
                  type="tel"
                  className="h-12 border-gray-300 rounded-md"
                  value={facility.secondaryPhone || ""}
                  onChange={(e) => setFacility((prev) => ({ ...prev, secondaryPhone: e.target.value }))}
                />
              ) : (
                <p className="text-sm text-gray-700">{facility.secondaryPhone}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800">Email</Label>
              {isEditing ? (
                <Input
                  type="email"
                  className="h-12 border-gray-300 rounded-md"
                  value={facility.email || ""}
                  onChange={(e) => setFacility((prev) => ({ ...prev, email: e.target.value }))}
                />
              ) : (
                <p className="text-sm text-gray-700">{facility.email}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800">Registration Number</Label>
              {isEditing ? (
                <Input
                  className="h-12 border-gray-300 rounded-md"
                  value={facility.registrationNumber || ""}
                  onChange={(e) => setFacility((prev) => ({ ...prev, registrationNumber: e.target.value }))}
                />
              ) : (
                <p className="text-sm text-gray-700">{facility.registrationNumber}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800">Website</Label>
              {isEditing ? (
                <Input
                  type="url"
                  className="h-12 border-gray-300 rounded-md"
                  value={facility.website || ""}
                  onChange={(e) => setFacility((prev) => ({ ...prev, website: e.target.value }))}
                />
              ) : (
                <a href={facility.website} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                  {facility.website}
                </a>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800">Created At</Label>
              <p className="text-sm text-gray-700">{new Date(facility.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hospital Information */}
      {Object.keys(hospitalData).length > 0 && (
        <Card className="border border-gray-200 shadow">
          <CardContent className="p-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-700">Hospital Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-800">Facility Type</Label>
                {isEditing ? (
                  <ShadSelect
                    value={hospitalData.type}
                    onValueChange={(val) => setHospitalData((prev) => ({ ...prev, type: val }))}
                  >
                    <SelectTrigger className="h-12 border-gray-300 rounded-md">
                      <SelectValue placeholder="Choose facility type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primary">Primary</SelectItem>
                      <SelectItem value="Secondary">Secondary</SelectItem>
                      <SelectItem value="Tertiary">Tertiary</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                ) : (
                  <p className="text-sm text-gray-700">{-hospitalData.type}</p>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-800">Upload Document</Label>
                  <div className="relative group cursor-pointer">
                    <Info className="w-4 h-4 text-gray-500" />
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 w-64">
                      Upload supporting documents like service lists or brochures.
                    </div>
                  </div>
                </div>
                {isEditing ? (
                  <Input
                    type="file"
                    className="h-12 border-gray-300 rounded-md"
                    onChange={(e) => handleFileChange("document", e, setHospitalData)}
                  />
                ) : (
                  <a href={`/${hospitalData.document}`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                    View Document
                  </a>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800 mb-1 block">Medical Specialties</Label>
              {isEditing ? (
                <Select
                  isMulti
                  options={CoreClinicalSpecialities}
                  className="text-sm"
                  value={CoreClinicalSpecialities.filter((spec) => hospitalData.specialties?.includes(spec.value))}
                  onChange={(selected) =>
                    setHospitalData((prev) => ({
                      ...prev,
                      specialties: selected.map((s) => s.value),
                    }))
                  }
                />
              ) : (
                <p className="text-sm text-gray-700">test</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800">Bed Space Billing</Label>
              {isEditing ? (
                <ShadSelect
                  value={hospitalData.bedSpaceBill?.paymentType}
                  onValueChange={(val) =>
                    setHospitalData((prev) => ({
                      ...prev,
                      bedSpaceBill: { paymentType: val },
                    }))
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
              ) : (
                <p className="text-sm text-gray-700">{hospitalData.bedSpaceBill?.paymentType}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800">Facility Features</Label>
              {isEditing ? (
                <div className="flex flex-wrap gap-4 mt-2">
                  {facilityFeatures.map((f) => (
                    <div key={f.id} className="flex items-center gap-2">
                      <Checkbox
                        id={f.id}
                        checked={hospitalData.features?.includes(f.id)}
                        onCheckedChange={() => handleFeatureChange(f.id)}
                      />
                      <Label htmlFor={f.id} className="text-sm text-gray-700">{f.label}</Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-700">test</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-800">Admission Fee</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    className="h-12 border-gray-300 rounded-md"
                    value={hospitalData.admissionFee || ""}
                    onChange={(e) => setHospitalData((prev) => ({ ...prev, admissionFee: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm text-gray-700">{hospitalData.admissionFee}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-800">Laboratory Available?</Label>
                {isEditing ? (
                  <ShadSelect
                    value={hospitalData.hasLaboratory ? "yes" : "no"}
                    onValueChange={(val) =>
                      setHospitalData((prev) => ({ ...prev, hasLaboratory: val === "yes" }))
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
                ) : (
                  <p className="text-sm text-gray-700">{hospitalData.hasLaboratory ? "Yes" : "No"}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-800">ICU Beds</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    className="h-12 border-gray-300 rounded-md"
                    value={hospitalData.icuBeds || ""}
                    onChange={(e) => setHospitalData((prev) => ({ ...prev, icuBeds: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm text-gray-700">{hospitalData.icuBeds}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-800">Wards</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    className="h-12 border-gray-300 rounded-md"
                    value={hospitalData.wards || ""}
                    onChange={(e) => setHospitalData((prev) => ({ ...prev, wards: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm text-gray-700">{hospitalData.wards}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Laboratory Information */}
      {Object.keys(laboratoryData).length > 0 && (
        <Card className="border border-gray-200 shadow">
          <CardContent className="p-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-700">Laboratory Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-800">List of Tests Conducted and Prices</Label>
                {isEditing ? (
                  <Input
                    type="file"
                    className="h-12 border-gray-300 rounded-md"
                    onChange={(e) => handleFileChange("testList", e, setLaboratoryData)}
                  />
                ) : (
                  <a href={`/${laboratoryData.testList}`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                    View Test List
                  </a>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-800">Certification Body</Label>
                {isEditing ? (
                  <Input
                    placeholder="Enter certification body name"
                    className="h-12 border-gray-300 rounded-md"
                    value={laboratoryData.certificationBody || ""}
                    onChange={(e) =>
                      setLaboratoryData((prev) => ({ ...prev, certificationBody: e.target.value }))
                    }
                  />
                ) : (
                  <p className="text-sm text-gray-700">{laboratoryData.certificationBody}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-800">Accreditation Status</Label>
                {isEditing ? (
                  <ShadSelect
                    value={laboratoryData.accreditationStatus}
                    onValueChange={(val) =>
                      setLaboratoryData((prev) => ({ ...prev, accreditationStatus: val }))
                    }
                  >
                    <SelectTrigger className="h-12 border-gray-300 rounded-md">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Awaiting">Awaiting</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                ) : (
                  <p className="text-sm text-gray-700">{laboratoryData.accreditationStatus}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-800">Home Sample Collection</Label>
                {isEditing ? (
                  <ShadSelect
                    value={laboratoryData.homeSampleCollection}
                    onValueChange={(val) =>
                      setLaboratoryData((prev) => ({ ...prev, homeSampleCollection: val }))
                    }
                  >
                    <SelectTrigger className="h-12 border-gray-300 rounded-md">
                      <SelectValue placeholder="Yes / No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                ) : (
                  <p className="text-sm text-gray-700">{laboratoryData.homeSampleCollection}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-800">Turnaround Time for Test Result</Label>
                {isEditing ? (
                  <Input
                    placeholder="e.g. 24 hours"
                    className="h-12 border-gray-300 rounded-md"
                    value={laboratoryData.turnaroundTime || ""}
                    onChange={(e) =>
                      setLaboratoryData((prev) => ({ ...prev, turnaroundTime: e.target.value }))
                    }
                  />
                ) : (
                  <p className="text-sm text-gray-700">{laboratoryData.turnaroundTime}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-800">Availability of COVID-19 Test</Label>
                {isEditing ? (
                  <ShadSelect
                    value={laboratoryData.hasCovidTest}
                    onValueChange={(val) =>
                      setLaboratoryData((prev) => ({ ...prev, hasCovidTest: val }))
                    }
                  >
                    <SelectTrigger className="h-12 border-gray-300 rounded-md">
                      <SelectValue placeholder="Yes / No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                ) : (
                  <p className="text-sm text-gray-700">{laboratoryData.hasCovidTest}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pharmacy Information */}
      {Object.keys(pharmacyData).length > 0 && (
        <Card className="border border-gray-200 shadow">
          <CardContent className="p-6 space-y-6">
            <h3 className="text-xl font-semibold text blames-gray-700">Pharmacy Information</h3>
            <div className="flex Renee-Colored">
              <Label className="text-sm font-medium text-gray-800">Branch Address</Label>
              {isEditing ? (
                <Input
                  value={pharmacyData.branchAddress || ""}
                  onChange={(e) =>
                    setPharmacyData((prev) => ({ ...prev, branchAddress: e.target.value }))
                  }
                  placeholder="Enter your branch address"
                  className="h-12 border-gray-300 rounded-md"
                />
              ) : (
                <p className="text-sm text-gray-700">{pharmacyData.branchAddress}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-800">Do you offer delivery?</Label>
                {isEditing ? (
                  <ShadSelect
                    value={pharmacyData.delivery}
                    onValueChange={(val) =>
                      setPharmacyData((prev) => ({ ...prev, delivery: val }))
                    }
                  >
                    <SelectTrigger className="h-12 border-gray-300 rounded-md">
                      <SelectValue placeholder="Yes / No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                ) : (
                  <p className="text-sm text-gray-700">{pharmacyData.delivery}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-800">Do you have a licensed pharmacist on-site?</Label>
                {isEditing ? (
                  <ShadSelect
                    value={pharmacyData.licensedPharmacist}
                    onValueChange={(val) =>
                      setPharmacyData((prev) => ({ ...prev, licensedPharmacist: val }))
                    }
                  >
                    <SelectTrigger className="h-12 border-gray-300 rounded-md">
                      <SelectValue placeholder="Yes / No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                ) : (
                  <p className="text-sm text-gray-700">{pharmacyData.licensedPharmacist}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-800">Business Hours</Label>
                {isEditing ? (
                  <div className="flex gap-4">
                    <Input
                      type="time"
                      value={pharmacyData.startTime || ""}
                      onChange={(e) =>
                        setPharmacyData((prev) => ({ ...prev, startTime: e.target.value }))
                      }
                      className="h-12 border-gray-300 rounded-md"
                    />
                    <Input
                      type="time"
                      value={pharmacyData.endTime || ""}
                      onChange={(e) =>
                        setPharmacyData((prev) => ({ ...prev, endTime: e.target.value }))
                      }
                      className="h-12 border-gray-300 rounded-md"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">
                    {pharmacyData.startTime} - {pharmacyData.endTime}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800">Compliance Documents</Label>
              {isEditing ? (
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={pharmacyData.complianceDocuments?.pcnLicense || false}
                      onCheckedChange={(checked) =>
                        setPharmacyData((prev) => ({
                          ...prev,
                          complianceDocuments: { ...prev.complianceDocuments, pcnLicense: checked },
                        }))
                      }
                    />
                    <Label className="text-sm text-gray-700">PCN License</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={pharmacyData.complianceDocuments?.nafdacCert || false}
                      onCheckedChange={(checked) =>
                        setPharmacyData((prev) => ({
                          ...prev,
                          complianceDocuments: { ...prev.complianceDocuments, nafdacCert: checked },
                        }))
                      }
                    />
                    <Label className="text-sm text-gray-700">NAFDAC Cert.</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={pharmacyData.complianceDocuments?.cac || false}
                      onCheckedChange={(checked) =>
                        setPharmacyData((prev) => ({
                          ...prev,
                          complianceDocuments: { ...prev.complianceDocuments, cac: checked },
                        }))
                      }
                    />
                    <Label className="text-sm text-gray-700">CAC</Label>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700">
                  {Object.keys(pharmacyData.complianceDocuments || {})
                    .filter((key) => pharmacyData.complianceDocuments[key])
                    .join(", ")}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800">Accepted Payments</Label>
              {isEditing ? (
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={pharmacyData.acceptedPayments?.nhis || false}
                      onCheckedChange={(checked) =>
                        setPharmacyData((prev) => ({
                          ...prev,
                          acceptedPayments: { ...prev.acceptedPayments, nhis: checked },
                        }))
                      }
                    />
                    <Label className="text-sm text-gray-700">NHIS</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={pharmacyData.acceptedPayments?.hmo || false}
                      onCheckedChange={(checked) =>
                        setPharmacyData((prev) => ({
                          ...prev,
                          acceptedPayments: { ...prev.acceptedPayments, hmo: checked },
                        }))
                      }
                    />
                    <Label className="text-sm text-gray-700">HMO</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={pharmacyData.acceptedPayments?.insuranceCards || false}
                      onCheckedChange={(checked) =>
                        setPharmacyData((prev) => ({
                          ...prev,
                          acceptedPayments: { ...prev.acceptedPayments, insuranceCards: checked },
                        }))
                      }
                    />
                    <Label className="text-sm text-gray-700">Insurance cards</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={pharmacyData.acceptedPayments?.discountsBulkPricing || false}
                      onCheckedChange={(checked) =>
                        setPharmacyData((prev) => ({
                          ...prev,
                          acceptedPayments: { ...prev.acceptedPayments, discountsBulkPricing: checked },
                        }))
                      }
                    />
                    <Label className="text-sm text-gray-700">Discounts/Bulk pricing</Label>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700">
                  {Object.keys(pharmacyData.acceptedPayments || {})
                    .filter((key) => pharmacyData.acceptedPayments[key])
                    .join(", ")}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-800">Upload Drug List (Price Catalog)</Label>
              {isEditing ? (
                <Input
                  type="file"
                  className="h-12 border-gray-300 rounded-md"
                  onChange={(e) => handleFileChange("drugList", e, setPharmacyData)}
                />
              ) : (
                <a href={`/${pharmacyData.drugList}`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                  View Drug List
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ambulance Information */}
      {Object.keys(ambulanceData).length > 0 && (
        <Card className="border border-gray-200 shadow">
          <CardContent className="p-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-700">Ambulance Information</h3>
            <div className="flex gap-5">
              <div className="flex-1 space-y-2.5">
                <Label>Services Provided</Label>
                {isEditing ? (
                  <ShadSelect
                    value={ambulanceData.servicesProvided}
                    onValueChange={(value) => setAmbulanceData((prev) => ({ ...prev, servicesProvided: value }))}
                  >
                    <SelectTrigger className="h-12 border-[#d7dbdf]">
                      <SelectValue placeholder="Inter-facility / Emergency Transfer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interfacility">Inter-Facility</SelectItem>
                      <SelectItem value="emergency">Emergency Response Transfers</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                ) : (
                  <p className="text-sm text-gray-700">{ambulanceData.servicesProvided}</p>
                )}
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex-1 space-y-2.5">
                <Label>Available 24/7?</Label>
                {isEditing ? (
                  <ShadSelect
                    value={ambulanceData.isAvailable24_7}
                    onValueChange={(value) => setAmbulanceData((prev) => ({ ...prev, isAvailable24_7: value }))}
                  >
                    <SelectTrigger className="h-12 border-[#d7dbdf]">
                      <SelectValue placeholder="Yes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                ) : (
                  <p className="text-sm text-gray-700">{ambulanceData.isAvailable24_7}</p>
                )}
              </div>
              {ambulanceData.isAvailable24_7 === "no" && (
                <div className="flex-1 space-y-2.5">
                  <Label>Specify Operating Hours</Label>
                  {isEditing ? (
                    <Input
                      className="h-12 border-[#d7dbdf]"
                      placeholder="e.g. 8AM - 6PM"
                      value={ambulanceData.operatingHours}
                      onChange={(e) => setAmbulanceData((prev) => ({ ...prev, operatingHours: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm text-gray-700">{ambulanceData.operatingHours}</p>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-2.5">
              <Label>Available for Event Standby?</Label>
              {isEditing ? (
                <ShadSelect
                  value={ambulanceData.eventStandby}
                  onValueChange={(value) => setAmbulanceData((prev) => ({ ...prev, eventStandby: value }))}
                >
                  <SelectTrigger className="h-12 border-[#d7dbdf]">
                    <SelectValue placeholder="Yes / No" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </ShadSelect>
              ) : (
                <p className="text-sm text-gray-700">{ambulanceData.eventStandby}</p>
              )}
            </div>
            <div className="space-y-2.5">
              <Label>Ambulance Types</Label>
              {isEditing ? (
                <div className="flex flex-wrap gap-3">
                  {ambulanceTypes.map((type) => (
                    <div key={type.id} className="flex items-center gap-1.5">
                      <Checkbox
                        id={type.id}
                        checked={ambulanceData.ambulanceTypes?.includes(type.id)}
                        onCheckedChange={(checked) =>
                          handleAmbulanceCheckboxChange("ambulanceTypes", type.id, checked)
                        }
                      />
                      <Label htmlFor={type.id}>{type.label}</Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-700">{ambulanceData.ambulanceTypes?.join(", ")}</p>
              )}
            </div>
            <div className="space-y-2.5">
              <Label>Equipment Available</Label>
              {isEditing ? (
                <div className="flex flex-wrap gap-3">
                  {equipmentChecklist.map((eq) => (
                    <div key={eq.id} className="flex items-center gap-1.5">
                      <Checkbox
                        id={eq.id}
                        checked={ambulanceData.equipment?.includes(eq.id)}
                        onCheckedChange={(checked) =>
                          handleAmbulanceCheckboxChange("equipment", eq.id, checked)
                        }
                      />
                      <Label htmlFor={eq.id}>{eq.label}</Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-700">{ambulanceData.equipment?.join(", ")}</p>
              )}
            </div>
            <div className="space-y-2.5">
              <Label>Typical Crew per Ambulance</Label>
              {isEditing ? (
                <div className="flex flex-wrap gap-3">
                  {crewTypes.map((crew) => (
                    <div key={crew.id} className="flex items-center gap-1.5">
                      <Checkbox
                        id={crew.id}
                        checked={ambulanceData.crew?.includes(crew.id)}
                        onCheckedChange={(checked) =>
                          handleAmbulanceCheckboxChange("crew", crew.id, checked)
                        }
                      />
                      <Label htmlFor={crew.id}>{crew.label}</Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-700">{ambulanceData.crew?.join(", ")}</p>
              )}
            </div>
            <div className="flex gap-5">
              <div className="flex-1 space-y-2.5">
                <Label>Average Response Time</Label>
                {isEditing ? (
                  <Input
                    placeholder="Urban/Rural e.g. 15 mins"
                    className="h-12 border-[#d7dbdf]"
                    value={ambulanceData.responseTime}
                    onChange={(e) => setAmbulanceData((prev) => ({ ...prev, responseTime: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm text-gray-700">{ambulanceData.responseTime}</p>
                )}
              </div>
              <div className="flex-1 space-y-2.5">
                <Label>Tracking Integration Available?</Label>
                {isEditing ? (
                  <ShadSelect
                    value={ambulanceData.trackingIntegration}
                    onValueChange={(value) => setAmbulanceData((prev) => ({ ...prev, trackingIntegration: value }))}
                  >
                    <SelectTrigger className="h-12 border-[#d7dbdf]">
                      <SelectValue placeholder="Yes / No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                ) : (
                  <p className="text-sm text-gray-700">{ambulanceData.trackingIntegration}</p>
                )}
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex-1 space-y-2.5">
                <Label>Number of Roadworthy Ambulances</Label>
                {isEditing ? (
                  <Input
                    placeholder="e.g. 5"
                    type="number"
                    className="h-12 border-[#d7dbdf]"
                    value={ambulanceData.numAmbulances}
                    onChange={(e) => setAmbulanceData((prev) => ({ ...prev, numAmbulances: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm text-gray-700">{ambulanceData.numAmbulances}</p>
                )}
              </div>
              <div className="flex-1 space-y-2.5">
                <Label>Max Daily Trips</Label>
                {isEditing ? (
                  <Input
                    placeholder="e.g. 10"
                    type="number"
                    className="h-12 border-[#d7dbdf]"
                    value={ambulanceData.maxDailyTrips}
                    onChange={(e) => setAmbulanceData((prev) => ({ ...prev, maxDailyTrips: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm text-gray-700">{ambulanceData.maxDailyTrips}</p>
                )}
              </div>
            </div>
            <div className="space-y-2.5">
              <Label>Backup Vehicles Available?</Label>
              {isEditing ? (
                <ShadSelect
                  value={ambulanceData.backupVehicles}
                  onValueChange={(value) => setAmbulanceData((prev) => ({ ...prev, backupVehicles: value }))}
                >
                  <SelectTrigger className="h-12 border-[#d7dbdf]">
                    <SelectValue placeholder="Yes / No" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </ShadSelect>
              ) : (
                <p className="text-sm text-gray-700">{ambulanceData.backupVehicles}</p>
              )}
            </div>
            <div className="space-y-2.5">
              <Label>Dedicated Emergency Contact</Label>
              {isEditing ? (
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  className="h-12 border-[#d7dbdf]"
                  value={ambulanceData.emergencyContact}
                  onChange={(e) => setAmbulanceData((prev) => ({ ...prev, emergencyContact: e.target.value }))}
                />
              ) : (
                <p className="text-sm text-gray-700">{ambulanceData.emergencyContact}</p>
              )}
            </div>
            <div className="flex gap-5">
              <div className="flex-1 space-y-2.5">
                <Label>Price Per Trip</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    placeholder="₦..."
                    className="h-12 border-[#d7dbdf]"
                    value={ambulanceData.pricePerTrip}
                    onChange={(e) => setAmbulanceData((prev) => ({ ...prev, pricePerTrip: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm text-gray-700">{ambulanceData.pricePerTrip}</p>
                )}
              </div>
              <div className="flex-1 space-y-2.5">
                <Label>Flat Rate for Inter-Hospital Transfers</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    placeholder="₦..."
                    className="h-12 border-[#d7dbdf]"
                    value={ambulanceData.flatRateInterHospital}
                    onChange={(e) => setAmbulanceData((prev) => ({ ...prev, flatRateInterHospital: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm text-gray-700">{ambulanceData.flatRateInterHospital}</p>
                )}
              </div>
            </div>
            <div className="space-y-2.5">
              <Label>Accepted Payment Methods</Label>
              {isEditing ? (
                <div className="flex flex-wrap gap-3">
                  {paymentMethods.map((option) => (
                    <div key={option.id} className="flex items-center gap-1.5">
                      <Checkbox
                        id={option.id}
                        checked={ambulanceData.paymentMethods?.includes(option.id)}
                        onCheckedChange={(checked) =>
                          handleAmbulanceCheckboxChange("paymentMethods", option.id, checked)
                        }
                      />
                      <Label htmlFor={option.id}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-700">{ambulanceData.paymentMethods?.join(", ")}</p>
              )}
            </div>
            <div className="flex gap-5">
              <div className="flex-1 space-y-2.5">
                <Label>Registered with Federal Ministry of Health?</Label>
                {isEditing ? (
                  <ShadSelect
                    value={ambulanceData.registeredFMoH}
                    onValueChange={(value) => setAmbulanceData((prev) => ({ ...prev, registeredFMoH: value }))}
                  >
                    <SelectTrigger className="h-12 border-[#d7dbdf]">
                      <SelectValue placeholder="Yes / No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                ) : (
                  <p className="text-sm text-gray-700">{ambulanceData.registeredFMoH}</p>
                )}
              </div>
              <div className="flex-1 space-y-2.5">
                <Label>Registered with NEMA?</Label>
                {isEditing ? (
                  <ShadSelect
                    value={ambulanceData.registeredNEMA}
                    onValueChange={(value) => setAmbulanceData((prev) => ({ ...prev, registeredNEMA: value }))}
                  >
                    <SelectTrigger className="h-12 border-[#d7dbdf]">
                      <SelectValue placeholder="Yes / No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                ) : (
                  <p className="text-sm text-gray-700">{ambulanceData.registeredNEMA}</p>
                )}
              </div>
            </div>
            <div className="space-y-2.5">
              <Label>Compliant with Nigerian Ambulance Service Regulations?</Label>
              {isEditing ? (
                <ShadSelect
                  value={ambulanceData.compliantRegulations}
                  onValueChange={(value) => setAmbulanceData((prev) => ({ ...prev, compliantRegulations: value }))}
                >
                  <SelectTrigger className="h-12 border-[#d7dbdf]">
                    <SelectValue placeholder="Yes / No" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </ShadSelect>
              ) : (
                <p className="text-sm text-gray-700">{ambulanceData.compliantRegulations}</p>
              )}
            </div>
            <div className="space-y-2.5">
              <Label>Safety Protocols</Label>
              {isEditing ? (
                <Textarea
                  className="h-24 border-[#d7dbdf]"
                  placeholder="Describe measures to prevent breakdowns or delays"
                  value={ambulanceData.safetyProtocols}
                  onChange={(e) => setAmbulanceData((prev) => ({ ...prev, safetyProtocols: e.target.value }))}
                />
              ) : (
                <p className="text-sm text-gray-700">{ambulanceData.safetyProtocols}</p>
              )}
            </div>
            <div className="flex gap-5">
              <div className="flex-1 space-y-2.5">
                <Label>License & Registration Certificate</Label>
                {isEditing ? (
                  <div className="flex h-12 items-center border border-dashed border-[#d7dbdf] rounded-md">
                    <div className="flex-1 px-4 py-3.5 text-fgsolid">
                      {ambulanceData.licenseFile ? ambulanceData.licenseFile.name : "Upload Certificate"}
                    </div>
                    <div className="px-4 py-3.5">
                      <Input
                        type="file"
                        className="hidden"
                        id="licenseFile"
                        onChange={(e) => handleFileChange("licenseFile", e, setAmbulanceData)}
                      />
                      <Label htmlFor="licenseFile">
                        <UploadIcon className="w-5 h-5 cursor-pointer" />
                      </Label>
                    </div>
                  </div>
                ) : (
                  <a href={`/${ambulanceData.licenseFile}`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                    View Certificate
                  </a>
                )}
              </div>
              <div className="flex-1 space-y-2.5">
                <Label>Price List</Label>
                {isEditing ? (
                  <div className="flex h-12 items-center border border-dashed border-[#d7dbdf] rounded-md">
                    <div className="flex-1 px-4 py-3.5 text-fgsolid">
                      {ambulanceData.priceListFile ? ambulanceData.priceListFile.name : "Upload Price List"}
                    </div>
                    <div className="px-4 py-3.5">
                      <Input
                        type="file"
                        className="hidden"
                        id="priceListFile"
                        onChange={(e) => handleFileChange("priceListFile", e, setAmbulanceData)}
                      />
                      <Label htmlFor="priceListFile">
                        <UploadIcon className="w-5 h-5 cursor-pointer" />
                      </Label>
                    </div>
                  </div>
                ) : (
                  <a href={`/${ambulanceData.priceListFile}`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                    View Price List
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Capabilities */}
      <Card className="border border-gray-200 shadow">
        <CardContent className="p-6 space-y-6">
          <h3 className="text-xl font-semibold text-gray-700">Facility Capabilities</h3>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-800">Weekly Operating Days</Label>
            {isEditing ? (
              <div className="flex flex-wrap gap-4">
                {weekDays.map((day) => (
                  <Label key={day} className="text-sm text-gray-700">
                    <input
                      type="checkbox"
                      value={day}
                      checked={capabilities.operatingDays?.includes(day)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const updated = checked
                          ? [...(capabilities.operatingDays || []), day]
                          : capabilities.operatingDays.filter((d) => d !== day);
                        setCapabilities((prev) => ({ ...prev, operatingDays: updated }));
                      }}
                    />
                    <span className="ml-1">{day}</span>
                  </Label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-700">{capabilities.operatingDays?.join(", ")}</p>
            )}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-800">Opening Time</Label>
              {isEditing ? (
                <Input
                  type="time"
                  className="h-12 border-gray-300 rounded-md"
                  value={capabilities.openingTime || ""}
                  onChange={(e) =>
                    setCapabilities((prev) => ({ ...prev, openingTime: e.target.value }))
                  }
                />
              ) : (
                <p className="text-sm text-gray-700">{capabilities.openingTime}</p>
              )}
            </div>
            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-800">Closing Time</Label>
              {isEditing ? (
                <Input
                  type="time"
                  className="h-12 border-gray-300 rounded-md"
                  value={capabilities.closingTime || ""}
                  onChange={(e) =>
                    setCapabilities((prev) => ({ ...prev, closingTime: e.target.value }))
                  }
                />
              ) : (
                <p className="text-sm text-gray-700">{capabilities.closingTime}</p>
              )}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-800">Agree to Terms</Label>
            {isEditing ? (
              <div className="mt-2">
                <input
                  type="checkbox"
                  checked={capabilities.agreedToTerms}
                  onChange={(e) =>
                    setCapabilities((prev) => ({ ...prev, agreedToTerms: e.target.checked }))
                  }
                />
                <span className="ml-2 text-sm text-gray-700">I agree to the terms and conditions</span>
              </div>
            ) : (
              <p className="text-sm text-gray-700">{capabilities.agreedToTerms ? "Agreed" : "Not Agreed"}</p>
            )}
          </div>
          {isEditing && (
            <div>
              <Label className="text-sm font-medium text-gray-800">Facility Images</Label>
              <Input
                type="file"
                className="h-12 border-gray-300 rounded-md"
                onChange={(e) => handleFileChange("facilityImages", e, setCapabilities)}
              />
            </div>
          )}
          {isEditing && (
            <div>
              <Label className="text-sm font-medium text-gray-800">Specialist Availability</Label>
              <Input
                type="file"
                className="h-12 border-gray-300 rounded-md"
                onChange={(e) => handleFileChange("specialistAvailability", e, setCapabilities)}
              />
            </div>
          )}
          {!isEditing && capabilities.facilityImages && (
            <div>
              <Label className="text-sm font-medium text-gray-800">Facility Images</Label>
              <a href={`/${capabilities.facilityImages}`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                View
              </a>
            </div>
          )}
          {!isEditing && capabilities.specialistAvailability && (
            <div>
              <Label className="text-sm font-medium text-gray-800">Specialist Availability</Label>
              <a href={`/${capabilities.specialistAvailability}`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                View
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {isEditing && (
        <div className="flex justify-end">
          <Button
            className="h-12 px-6 bg-primarysolid text-white rounded-md"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default FacilityDetail;