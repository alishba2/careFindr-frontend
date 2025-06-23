import { UploadIcon } from "lucide-react";
import React, { useState } from "react";
import { Card, CardContent } from "../../components/card";
import { Checkbox } from "../../components/checkbox";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { Textarea } from "../../components/textArea";
import { Button } from "../../components/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/select";

export const AmbulanceIs = ({ services, setServices, onNext, onBack }) => {
  // State for all form fields
  const [formData, setFormData] = useState({
    is24_7: "yes",
    operatingHours: "",
    servicesProvided: "",
    eventStandby: "",
    ambulanceTypes: [],
    equipment: [],
    crew: [],
    responseTime: "",
    trackingIntegration: "",
    numAmbulances: "",
    maxDailyTrips: "",
    backupVehicles: "",
    emergencyContact: "",
    pricePerTrip: "",
    flatRateInterHospital: "",
    paymentMethods: [],
    registeredFMoH: "",
    registeredNEMA: "",
    compliantRegulations: "",
    safetyProtocols: "",
    licenseFile: null,
    priceListFile: null,
  });

  const ambulanceTypes = [
    { id: "bls", label: "Basic Life Support (BLS)" },
    { id: "als", label: "Advanced Life Support (ALS)" },
    { id: "neonatal", label: "Neonatal/ICU Transport" },
  ];

  const equipmentChecklist = [
    { id: "cardiac", label: "Cardiac monitors/defibrillators" },
    { id: "oxygen", label: "Oxygen & Suction Units" },
    { id: "stretchers", label: "Stretcher and immobilization devices" },
    { id: "ventilators", label: "Ventilators (for ALS)" },
  ];

  const crewTypes = [
    { id: "driver", label: "Driver" },
    { id: "paramedic", label: "Paramedic" },
    { id: "nurse", label: "Nurse" },
    { id: "doctor", label: "Doctor" },
  ];

  const paymentMethods = [
    { id: "nhis", label: "NHIS" },
    { id: "privateInsurance", label: "Private Insurance" },
    { id: "cashCard", label: "Cash/Card Payments" },
  ];

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle checkbox changes for multi-select fields
  const handleCheckboxChange = (field, id, checked) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      if (checked) {
        return { ...prev, [field]: [...current, id] };
      } else {
        return { ...prev, [field]: current.filter((item) => item !== id) };
      }
    });
  };

  // Handle file uploads
  const handleFileChange = (field, event) => {
    const file = event.target.files[0];
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Basic validation
    if (!formData.servicesProvided) {
      alert("Please select a service type.");
      return;
    }
    if (formData.is24_7 === "no" && !formData.operatingHours) {
      alert("Please specify operating hours.");
      return;
    }

    const ambulanceData = {
      isAvailable24_7: formData.is24_7,
      operatingHours: formData.operatingHours,
      servicesProvided: formData.servicesProvided,
      eventStandby: formData.eventStandby,
      ambulanceTypes: formData.ambulanceTypes,
      equipment: formData.equipment,
      crew: formData.crew,
      responseTime: formData.responseTime,
      trackingIntegration: formData.trackingIntegration,
      numAmbulances: formData.numAmbulances,
      maxDailyTrips: formData.maxDailyTrips,
      backupVehicles: formData.backupVehicles,
      emergencyContact: formData.emergencyContact,
      pricePerTrip: formData.pricePerTrip,
      flatRateInterHospital: formData.flatRateInterHospital,
      paymentMethods: formData.paymentMethods,
      registeredFMoH: formData.registeredFMoH,
      registeredNEMA: formData.registeredNEMA,
      compliantRegulations: formData.compliantRegulations,
      safetyProtocols: formData.safetyProtocols,
      licenseFile: formData.licenseFile ? formData.licenseFile.name : null, // Store file name or handle file upload separately
      priceListFile: formData.priceListFile ? formData.priceListFile.name : null,
    };

    const updated = {
      ...services,
      ambulance: ambulanceData,
    };

    try {
      setServices(updated);
      onNext(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to save ambulance services.");
    }
  };

  return (
    <main className="flex flex-col w-full items-center bg-white">
      <header className="flex w-full h-20 items-center justify-between px-20 bg-bgdefault-bg">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <div className="w-[83px] h-9">
              <h1 className="font-bold text-primarysolid text-4xl tracking-[-0.36px]">Logo</h1>
            </div>
          </div>
        </div>
      </header>

      <section className="flex flex-col items-center gap-10 py-10 w-full">
        <div className="flex flex-col w-[768px] items-center gap-10">
          <div className="flex flex-col w-full items-start gap-2.5">
            <h2 className="text-[30px] font-semibold text-fgtext-contrast">Ambulance Services</h2>
          </div>

          <Card className="w-full p-5 bg-bgdefault-bg border-[#dfe3e6] shadow-box-shadow-shadow">
            <CardContent className="p-0 space-y-6">
              <Card className="w-full p-5 bg-bgdefault-bg border-[#dfe3e6] shadow-box-shadow-shadow">
                <CardContent className="p-0 space-y-6">
                  <div className="flex gap-5">
                    <div className="flex-1 space-y-2.5">
                      <Label>Services Provided</Label>
                      <Select
                        value={formData.servicesProvided}
                        onValueChange={(value) => handleInputChange("servicesProvided", value)}
                      >
                        <SelectTrigger className="h-12 border-[#d7dbdf]">
                          <SelectValue placeholder="Inter-facility / Emergency Transfer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="interfacility">Inter-Facility</SelectItem>
                          <SelectItem value="emergency">Emergency Response Transfers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-1 space-y-2.5">
                      <Label>Available 24/7?</Label>
                      <Select
                        value={formData.is24_7}
                        onValueChange={(value) => handleInputChange("is24_7", value)}
                      >
                        <SelectTrigger className="h-12 border-[#d7dbdf]">
                          <SelectValue placeholder="Yes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.is24_7 === "no" && (
                      <div className="flex-1 space-y-2.5">
                        <Label>Specify Operating Hours</Label>
                        <Input
                          className="h-12 border-[#d7dbdf]"
                          placeholder="e.g. 8AM - 6PM"
                          value={formData.operatingHours}
                          onChange={(e) => handleInputChange("operatingHours", e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <Label>Available for Event Standby?</Label>
                    <Select
                      value={formData.eventStandby}
                      onValueChange={(value) => handleInputChange("eventStandby", value)}
                    >
                      <SelectTrigger className="h-12 border-[#d7dbdf]">
                        <SelectValue placeholder="Yes / No" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2.5">
                    <Label>Ambulance Types</Label>
                    <div className="flex flex-wrap gap-3">
                      {ambulanceTypes.map((type) => (
                        <div key={type.id} className="flex items-center gap-1.5">
                          <Checkbox
                            id={type.id}
                            checked={formData.ambulanceTypes.includes(type.id)}
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
                            checked={formData.equipment.includes(eq.id)}
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
                            checked={formData.crew.includes(crew.id)}
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
                        value={formData.responseTime}
                        onChange={(e) => handleInputChange("responseTime", e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2.5">
                      <Label>Tracking Integration Available?</Label>
                      <Select
                        value={formData.trackingIntegration}
                        onValueChange={(value) => handleInputChange("trackingIntegration", value)}
                      >
                        <SelectTrigger className="h-12 border-[#d7dbdf]">
                          <SelectValue placeholder="Yes / No" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-1 space-y-2.5">
                      <Label>Number of Roadworthy Ambulances</Label>
                      <Input
                        placeholder="e.g. 5"
                        type="number"
                        className="h-12 border-[#d7dbdf]"
                        value={formData.numAmbulances}
                        onChange={(e) => handleInputChange("numAmbulances", e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2.5">
                      <Label>Max Daily Trips</Label>
                      <Input
                        placeholder="e.g. 10"
                        type="number"
                        className="h-12 border-[#d7dbdf]"
                        value={formData.maxDailyTrips}
                        onChange={(e) => handleInputChange("maxDailyTrips", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label>Backup Vehicles Available?</Label>
                    <Select
                      value={formData.backupVehicles}
                      onValueChange={(value) => handleInputChange("backupVehicles", value)}
                    >
                      <SelectTrigger className="h-12 border-[#d7dbdf]">
                        <SelectValue placeholder="Yes / No" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2.5">
                    <Label>Dedicated Emergency Contact</Label>
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      className="h-12 border-[#d7dbdf]"
                      value={formData.emergencyContact}
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
                        value={formData.pricePerTrip}
                        onChange={(e) => handleInputChange("pricePerTrip", e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2.5">
                      <Label>Flat Rate for Inter-Hospital Transfers</Label>
                      <Input
                        type="number"
                        placeholder="₦..."
                        className="h-12 border-[#d7dbdf]"
                        value={formData.flatRateInterHospital}
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
                            checked={formData.paymentMethods.includes(option.id)}
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
                      <Select
                        value={formData.registeredFMoH}
                        onValueChange={(value) => handleInputChange("registeredFMoH", value)}
                      >
                        <SelectTrigger className="h-12 border-[#d7dbdf]">
                          <SelectValue placeholder="Yes / No" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1 space-y-2.5">
                      <Label>Registered with NEMA?</Label>
                      <Select
                        value={formData.registeredNEMA}
                        onValueChange={(value) => handleInputChange("registeredNEMA", value)}
                      >
                        <SelectTrigger className="h-12 border-[#d7dbdf]">
                          <SelectValue placeholder="Yes / No" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label>Compliant with Nigerian Ambulance Service Regulations?</Label>
                    <Select
                      value={formData.compliantRegulations}
                      onValueChange={(value) => handleInputChange("compliantRegulations", value)}
                    >
                      <SelectTrigger className="h-12 border-[#d7dbdf]">
                        <SelectValue placeholder="Yes / No" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2.5">
                    <Label>Safety Protocols</Label>
                    <Textarea
                      className="h-24"
                      placeholder="Describe measures to prevent breakdowns or delays"
                      value={formData.safetyProtocols}
                      onChange={(e) => handleInputChange("safetyProtocols", e.target.value)}
                    />
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-1 space-y-2.5">
                      <Label>License & Registration Certificate</Label>
                      <div className="flex h-12 items-center border border-dashed border-[#d7dbdf] rounded-md">
                        <div className="flex-1 px-4 py-3.5 text-fgsolid">
                          {formData.licenseFile ? formData.licenseFile.name : "Upload Certificate"}
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
                          {formData.priceListFile ? formData.priceListFile.name : "Upload Price List"}
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

          <div className="flex items-start gap-5 w-full">
            <Button
              variant="outline"
              className="flex-1 h-12 bg-bgbg-hover text-fgtext-contrast font-input-medium-semi-bold rounded-xl"
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              className="flex-1 h-12 bg-primarysolid text-primaryon-primary font-input-medium-semi-bold rounded-xl"
              onClick={handleSubmit}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};