import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
import Select from "react-select";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { Input } from "../../components/input";
import { Checkbox } from "../../components/checkbox";
import { Label } from "../../components/label";
import { Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/select";
import { UploadIcon } from "lucide-react";
import { medicalSpecialties } from "../enums/medicalSpecialities";
import { useAuth } from "../hook/auth";
import { Textarea } from "../../components/textArea";


export default function EditServices({ services }) {
  const { authData } = useAuth();
  const [hospitalData, setHospitalData] = useState(null);
  const [laboratoryData, setLaboratoryData] = useState(null);
  const [pharmacyData, setPharmacyData] = useState(null);
  const [ambulanceData, setAmbulanceData] = useState(null);
  const [capabilities, setCapabilities] = useState(null);

  // Sample data for checkboxes (to be replaced with actual enums if available)
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

  useEffect(() => {
    if (authData?.services || services) {
      const data = authData?.services || services || {};
      setHospitalData(data.hospital || {});
      setLaboratoryData(data.laboratory || {});
      setPharmacyData(data.pharmacy || {});
      setAmbulanceData(data.ambulance || {});
      setCapabilities(data.capabilities || {});
    }
  }, [authData, services]);

  if (!hospitalData || !laboratoryData || !pharmacyData || !ambulanceData || !capabilities)
    return <p className="text-center py-10">Loading services...</p>;

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

  const handleFeatureChange = (id) => {
    const updated = hospitalData.features?.includes(id)
      ? hospitalData.features.filter((f) => f !== id)
      : [...(hospitalData.features || []), id];
    setHospitalData({ ...hospitalData, features: updated });
  };

  const handleInputChange = (field, value) => {
    setAmbulanceData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, id, checked) => {
    setAmbulanceData((prev) => {
      const current = prev[field] || [];
      return {
        ...prev,
        [field]: checked ? [...current, id] : current.filter((item) => item !== id),
      };
    });
  };

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    setAmbulanceData((prev) => ({ ...prev, [field]: file }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Edit Services</h2>

      {/* Hospital Information */}
      {Object.keys(hospitalData).length > 0 && (
        <Card className="border border-gray-200 shadow">
          <CardContent className="p-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-700">Hospital Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-800">Facility Type</label>
                <ShadSelect
                  value={hospitalData.type}
                  onValueChange={(val) => setHospitalData((p) => ({ ...p, type: val }))}
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
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-800">Upload Document</label>
                  <div className="relative group cursor-pointer">
                    <Info className="w-4 h-4 text-gray-500" />
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 w-64">
                      Upload supporting documents like service lists or brochures.
                    </div>
                  </div>
                </div>
                <Input type="file" className="h-12 border-gray-300 rounded-md" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-800 mb-1 block">Medical Specialties</label>
              <Select
                isMulti
                options={medicalSpecialties}
                className="text-sm"
                value={medicalSpecialties.filter((spec) => hospitalData.specialties?.includes(spec.value))}
                onChange={(selected) =>
                  setHospitalData((prev) => ({
                    ...prev,
                    specialties: selected.map((s) => s.value),
                  }))
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-800">Bed Space Billing</label>
              <ShadSelect
                value={hospitalData.bedSpaceBill?.paymentType}
                onValueChange={(val) =>
                  setHospitalData((p) => ({
                    ...p,
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
            </div>

            <div>
              <label className="text-sm font-medium text-gray-800">Facility Features</label>
              <div className="flex flex-wrap gap-4 mt-2">
                {facilityFeatures.map((f) => (
                  <div key={f.id} className="flex items-center gap-2">
                    <Checkbox
                      id={f.id}
                      checked={hospitalData.features?.includes(f.id)}
                      onCheckedChange={() => handleFeatureChange(f.id)}
                    />
                    <label htmlFor={f.id} className="text-sm text-gray-700">
                      {f.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-800">Admission Fee</label>
                <Input
                  type="number"
                  className="h-12 border-gray-300 rounded-md"
                  value={hospitalData.admissionFee || ""}
                  onChange={(e) => setHospitalData((p) => ({ ...p, admissionFee: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800">Laboratory Available?</label>
                <ShadSelect
                  value={hospitalData.hasLaboratory ? "yes" : "no"}
                  onValueChange={(val) =>
                    setHospitalData((p) => ({ ...p, hasLaboratory: val === "yes" }))
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
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800">ICU Beds</label>
                <Input
                  type="number"
                  className="h-12 border-gray-300 rounded-md"
                  value={hospitalData.icuBeds || ""}
                  onChange={(e) => setHospitalData((p) => ({ ...p, icuBeds: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800">Wards</label>
                <Input
                  type="number"
                  className="h-12 border-gray-300 rounded-md"
                  value={hospitalData.wards || ""}
                  onChange={(e) => setHospitalData((p) => ({ ...p, wards: e.target.value }))}
                />
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
                <label className="text-sm font-medium text-gray-800">List of Tests Conducted and Prices</label>
                <Input type="file" className="h-12 border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800">Certification Body</label>
                <Input
                  placeholder="Enter certification body name"
                  className="h-12 border-gray-300 rounded-md"
                  value={laboratoryData.certificationBody || ""}
                  onChange={(e) =>
                    setLaboratoryData((prev) => ({ ...prev, certificationBody: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800">Accreditation Status</label>
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
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800">Home Sample Collection</label>
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
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800">Turnaround Time for Test Result</label>
                <Input
                  placeholder="e.g. 24 hours"
                  className="h-12 border-gray-300 rounded-md"
                  value={laboratoryData.turnaroundTime || ""}
                  onChange={(e) =>
                    setLaboratoryData((prev) => ({ ...prev, turnaroundTime: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800">Availability of COVID-19 Test</label>
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
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pharmacy Information */}
      {Object.keys(pharmacyData).length > 0 && (
        <Card className="border border-gray-200 shadow">
          <CardContent className="p-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-700">Pharmacy Information</h3>
            <div className="flex flex-col gap-4">
              <label className="text-sm font-medium text-gray-800">Branch Address</label>
              <Input
                value={pharmacyData.branchAddress || ""}
                onChange={(e) =>
                  setPharmacyData((prev) => ({ ...prev, branchAddress: e.target.value }))
                }
                placeholder="Enter your branch address"
                className="h-12 border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-800">Do you offer delivery?</label>
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
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800">Do you have a licensed pharmacist on-site?</label>
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-800">Business Hours</label>
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
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-800">Compliance Documents</label>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={pharmacyData.complianceDocuments?.pcnLicense || false}
                    onCheckedChange={(checked) =>
                      setPharmacyData((prev) => ({
                        ...prev,
                        complianceDocuments: {
                          ...prev.complianceDocuments,
                          pcnLicense: checked,
                        },
                      }))
                    }
                  />
                  <label className="text-sm text-gray-700">PCN License</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={pharmacyData.complianceDocuments?.nafdacCert || false}
                    onCheckedChange={(checked) =>
                      setPharmacyData((prev) => ({
                        ...prev,
                        complianceDocuments: {
                          ...prev.complianceDocuments,
                          nafdacCert: checked,
                        },
                      }))
                    }
                  />
                  <label className="text-sm text-gray-700">NAFDAC Cert.</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={pharmacyData.complianceDocuments?.cac || false}
                    onCheckedChange={(checked) =>
                      setPharmacyData((prev) => ({
                        ...prev,
                        complianceDocuments: {
                          ...prev.complianceDocuments,
                          cac: checked,
                        },
                      }))
                    }
                  />
                  <label className="text-sm text-gray-700">CAC</label>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-800">Accepted Payments</label>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={pharmacyData.acceptedPayments?.nhis || false}
                    onCheckedChange={(checked) =>
                      setPharmacyData((prev) => ({
                        ...prev,
                        acceptedPayments: {
                          ...prev.acceptedPayments,
                          nhis: checked,
                        },
                      }))
                    }
                  />
                  <label className="text-sm text-gray-700">NHIS</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={pharmacyData.acceptedPayments?.hmo || false}
                    onCheckedChange={(checked) =>
                      setPharmacyData((prev) => ({
                        ...prev,
                        acceptedPayments: {
                          ...prev.acceptedPayments,
                          hmo: checked,
                        },
                      }))
                    }
                  />
                  <label className="text-sm text-gray-700">HMO</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={pharmacyData.acceptedPayments?.insuranceCards || false}
                    onCheckedChange={(checked) =>
                      setPharmacyData((prev) => ({
                        ...prev,
                        acceptedPayments: {
                          ...prev.acceptedPayments,
                          insuranceCards: checked,
                        },
                      }))
                    }
                  />
                  <label className="text-sm text-gray-700">Insurance cards</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={pharmacyData.acceptedPayments?.discountsBulkPricing || false}
                    onCheckedChange={(checked) =>
                      setPharmacyData((prev) => ({
                        ...prev,
                        acceptedPayments: {
                          ...prev.acceptedPayments,
                          discountsBulkPricing: checked,
                        },
                      }))
                    }
                  />
                  <label className="text-sm text-gray-700">Discounts/Bulk pricing</label>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-800">Upload Drug List (Price Catalog)</label>
                <Input
                  type="file"
                  className="h-12 border-gray-300 rounded-md"
                  onChange={(e) =>
                    setPharmacyData((prev) => ({ ...prev, drugList: e.target.files[0] }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ambulance Information */}
      {Object.keys(ambulanceData).length > 0 && (
        <Card className="w-full p-5 bg-bgdefault-bg border-[#dfe3e6] shadow-box-shadow-shadow">
          <CardContent className="p-0 space-y-6">
            <Card className="w-full p-5 bg-bgdefault-bg border-[#dfe3e6] shadow-box-shadow-shadow">
              <CardContent className="p-0 space-y-6">
                <h3 className="text-xl font-semibold text-gray-700">Ambulance Information</h3>

                <div className="flex gap-5">
                  <div className="flex-1 space-y-2.5">
                    <Label>Services Provided</Label>
                    <ShadSelect
                      value={ambulanceData.servicesProvided}
                      onValueChange={(value) => handleInputChange("servicesProvided", value)}
                    >
                      <SelectTrigger className="h-12 border-[#d7dbdf]">
                        <SelectValue placeholder="Inter-facility / Emergency Transfer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interfacility">Inter-Facility</SelectItem>
                        <SelectItem value="emergency">Emergency Response Transfers</SelectItem>
                      </SelectContent>
                    </ShadSelect>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-1 space-y-2.5">
                    <Label>Available 24/7?</Label>
                    <ShadSelect
                      value={ambulanceData.isAvailable24_7}
                      onValueChange={(value) => handleInputChange("isAvailable24_7", value)}
                    >
                      <SelectTrigger className="h-12 border-[#d7dbdf]">
                        <SelectValue placeholder="Yes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </ShadSelect>
                  </div>
                  {ambulanceData.isAvailable24_7 === "no" && (
                    <div className="flex-1 space-y-2.5">
                      <Label>Specify Operating Hours</Label>
                      <Input
                        className="h-12 border-[#d7dbdf]"
                        placeholder="e.g. 8AM - 6PM"
                        value={ambulanceData.operatingHours}
                        onChange={(e) => handleInputChange("operatingHours", e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2.5">
                  <Label>Available for Event Standby?</Label>
                  <ShadSelect
                    value={ambulanceData.eventStandby}
                    onValueChange={(value) => handleInputChange("eventStandby", value)}
                  >
                    <SelectTrigger className="h-12 border-[#d7dbdf]">
                      <SelectValue placeholder="Yes / No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                </div>

                <div className="space-y-2.5">
                  <Label>Ambulance Types</Label>
                  <div className="flex flex-wrap gap-3">
                    {ambulanceTypes.map((type) => (
                      <div key={type.id} className="flex items-center gap-1.5">
                        <Checkbox
                          id={type.id}
                          checked={ambulanceData.ambulanceTypes?.includes(type.id)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("ambulanceTypes", type.id, checked)
                          }
                        />
                        <Label htmlFor={type.id}>{type.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label>Equipment Available</Label>
                  <div className="flex flex-wrap gap-3">
                    {equipmentChecklist.map((eq) => (
                      <div key={eq.id} className="flex items-center gap-1.5">
                        <Checkbox
                          id={eq.id}
                          checked={ambulanceData.equipment?.includes(eq.id)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("equipment", eq.id, checked)
                          }
                        />
                        <Label htmlFor={eq.id}>{eq.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label>Typical Crew per Ambulance</Label>
                  <div className="flex flex-wrap gap-3">
                    {crewTypes.map((crew) => (
                      <div key={crew.id} className="flex items-center gap-1.5">
                        <Checkbox
                          id={crew.id}
                          checked={ambulanceData.crew?.includes(crew.id)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("crew", crew.id, checked)
                          }
                        />
                        <Label htmlFor={crew.id}>{crew.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-1 space-y-2.5">
                    <Label>Average Response Time</Label>
                    <Input
                      placeholder="Urban/Rural e.g. 15 mins"
                      className="h-12 border-[#d7dbdf]"
                      value={ambulanceData.responseTime}
                      onChange={(e) => handleInputChange("responseTime", e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-2.5">
                    <Label>Tracking Integration Available?</Label>
                    <ShadSelect
                      value={ambulanceData.trackingIntegration}
                      onValueChange={(value) => handleInputChange("trackingIntegration", value)}
                    >
                      <SelectTrigger className="h-12 border-[#d7dbdf]">
                        <SelectValue placeholder="Yes / No" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </ShadSelect>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-1 space-y-2.5">
                    <Label>Number of Roadworthy Ambulances</Label>
                    <Input
                      placeholder="e.g. 5"
                      type="number"
                      className="h-12 border-[#d7dbdf]"
                      value={ambulanceData.numAmbulances}
                      onChange={(e) => handleInputChange("numAmbulances", e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-2.5">
                    <Label>Max Daily Trips</Label>
                    <Input
                      placeholder="e.g. 10"
                      type="number"
                      className="h-12 border-[#d7dbdf]"
                      value={ambulanceData.maxDailyTrips}
                      onChange={(e) => handleInputChange("maxDailyTrips", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label>Backup Vehicles Available?</Label>
                  <ShadSelect
                    value={ambulanceData.backupVehicles}
                    onValueChange={(value) => handleInputChange("backupVehicles", value)}
                  >
                    <SelectTrigger className="h-12 border-[#d7dbdf]">
                      <SelectValue placeholder="Yes / No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                </div>

                <div className="space-y-2.5">
                  <Label>Dedicated Emergency Contact</Label>
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    className="h-12 border-[#d7dbdf]"
                    value={ambulanceData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  />
                </div>

                <div className="flex gap-5">
                  <div className="flex-1 space-y-2.5">
                    <Label>Price Per Trip</Label>
                    <Input
                      type="number"
                      placeholder="₦..."
                      className="h-12 border-[#d7dbdf]"
                      value={ambulanceData.pricePerTrip}
                      onChange={(e) => handleInputChange("pricePerTrip", e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-2.5">
                    <Label>Flat Rate for Inter-Hospital Transfers</Label>
                    <Input
                      type="number"
                      placeholder="₦..."
                      className="h-12 border-[#d7dbdf]"
                      value={ambulanceData.flatRateInterHospital}
                      onChange={(e) => handleInputChange("flatRateInterHospital", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label>Accepted Payment Methods</Label>
                  <div className="flex flex-wrap gap-3">
                    {paymentMethods.map((option) => (
                      <div key={option.id} className="flex items-center gap-1.5">
                        <Checkbox
                          id={option.id}
                          checked={ambulanceData.paymentMethods?.includes(option.id)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("paymentMethods", option.id, checked)
                          }
                        />
                        <Label htmlFor={option.id}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-1 space-y-2.5">
                    <Label>Registered with Federal Ministry of Health?</Label>
                    <ShadSelect
                      value={ambulanceData.registeredFMoH}
                      onValueChange={(value) => handleInputChange("registeredFMoH", value)}
                    >
                      <SelectTrigger className="h-12 border-[#d7dbdf]">
                        <SelectValue placeholder="Yes / No" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </ShadSelect>
                  </div>
                  <div className="flex-1 space-y-2.5">
                    <Label>Registered with NEMA?</Label>
                    <ShadSelect
                      value={ambulanceData.registeredNEMA}
                      onValueChange={(value) => handleInputChange("registeredNEMA", value)}
                    >
                      <SelectTrigger className="h-12 border-[#d7dbdf]">
                        <SelectValue placeholder="Yes / No" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </ShadSelect>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label>Compliant with Nigerian Ambulance Service Regulations?</Label>
                  <ShadSelect
                    value={ambulanceData.compliantRegulations}
                    onValueChange={(value) => handleInputChange("compliantRegulations", value)}
                  >
                    <SelectTrigger className="h-12 border-[#d7dbdf]">
                      <SelectValue placeholder="Yes / No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                </div>

                <div className="space-y-2.5">
                  <Label>Safety Protocols</Label>
                  <Textarea
                    className="h-24 border-[#d7dbdf]"
                    placeholder="Describe measures to prevent breakdowns or delays"
                    value={ambulanceData.safetyProtocols}
                    onChange={(e) => handleInputChange("safetyProtocols", e.target.value)}
                  />
                </div>

                <div className="flex gap-5">
                  <div className="flex-1 space-y-2.5">
                    <Label>License & Registration Certificate</Label>
                    <div className="flex h-12 items-center border border-dashed border-[#d7dbdf] rounded-md">
                      <div className="flex-1 px-4 py-3.5 text-fgsolid">
                        {ambulanceData.licenseFile ? ambulanceData.licenseFile.name : "Upload Certificate"}
                      </div>
                      <div className="px-4 py-3.5">
                        <Input
                          type="file"
                          className="hidden"
                          id="licenseFile"
                          onChange={(e) => handleFileChange("licenseFile", e)}
                        />
                        <Label htmlFor="licenseFile">
                          <UploadIcon className="w-5 h-5 cursor-pointer" />
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2.5">
                    <Label>Price List</Label>
                    <div className="flex h-12 items-center border border-dashed border-[#d7dbdf] rounded-md">
                      <div className="flex-1 px-4 py-3.5 text-fgsolid">
                        {ambulanceData.priceListFile ? ambulanceData.priceListFile.name : "Upload Price List"}
                      </div>
                      <div className="px-4 py-3.5">
                        <Input
                          type="file"
                          className="hidden"
                          id="priceListFile"
                          onChange={(e) => handleFileChange("priceListFile", e)}
                        />
                        <Label htmlFor="priceListFile">
                          <UploadIcon className="w-5 h-5 cursor-pointer" />
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* Capabilities (always present) */}
      <Card className="border border-gray-200 shadow">
        <CardContent className="p-6 space-y-6">
          <h3 className="text-xl font-semibold text-gray-700">Facility Capabilities</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Weekly Operating Days</label>
            <div className="flex flex-wrap gap-4">
              {weekDays.map((day) => (
                <label key={day} className="text-sm text-gray-700">
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
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-800">Opening Time</label>
              <Input
                type="time"
                className="h-12 border-gray-300 rounded-md"
                value={capabilities.openingTime || ""}
                onChange={(e) =>
                  setCapabilities((prev) => ({ ...prev, openingTime: e.target.value }))
                }
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-800">Closing Time</label>
              <Input
                type="time"
                className="h-12 border-gray-300 rounded-md"
                value={capabilities.closingTime || ""}
                onChange={(e) =>
                  setCapabilities((prev) => ({ ...prev, closingTime: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800">Agree to Terms</label>
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
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="h-12 px-6 bg-primarysolid text-white rounded-md">Save Changes</Button>
      </div>
    </div>
  );
}