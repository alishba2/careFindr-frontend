import React, { useState, useRef } from "react";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { Input } from "../../components/input";

export function FacilityCapabilities({ formData, onNext, onBack, setFinish }) {
  const [openingTime, setOpeningTime] = useState("12:00");
  const [closingTime, setClosingTime] = useState("12:00");
  const [selectedDays, setSelectedDays] = useState([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Refs for file inputs
  const facilityImagesRef = useRef(null);
  const licenseRef = useRef(null);
  const specialistRef = useRef(null);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedDays([...selectedDays, value]);
    } else {
      setSelectedDays(selectedDays.filter((day) => day !== value));
    }
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      alert("You must agree to the terms and conditions.");
      return;
    }

    setLoading(true);
    try {
      // Append values to formData
      formData.append("capabilities[openingTime]", openingTime);
      formData.append("capabilities[closingTime]", closingTime);
      formData.append("capabilities[agreedToTerms]", agreedToTerms);
      formData.append("capabilities[additionalInfo]", additionalInfo);
      selectedDays.forEach((day) => {
        formData.append("capabilities[operatingDays][]", day);
      });

      // Append facility images
      if (facilityImagesRef.current?.files.length) {
        Array.from(facilityImagesRef.current.files).forEach((file) => {
          formData.append("capabilities[facilityImages]", file);
        });
      }

      // Append license doc
      if (licenseRef.current?.files[0]) {
        formData.append("capabilities[licenseDoc]", licenseRef.current.files[0]);
      }

      // Append specialist availability
      if (specialistRef.current?.files[0]) {
        formData.append("capabilities[specialistAvailability]", specialistRef.current.files[0]);
      }

      setFinish(true); // Signal onboarding is complete
    } catch (err) {
      console.error(err);
      alert("Failed to save capabilities.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-center bg-white">
      <header className="flex w-full h-20 items-center justify-between px-20 bg-bgdefault-bg">
        <div className="flex items-center">
          <h1 className="font-bold text-primarysolid text-4xl">Logo</h1>
        </div>
      </header>

      <main className="flex flex-col items-center gap-10 pt-10 pb-0 px-0 w-full max-w-[768px]">
        <div className="flex flex-col w-full items-start gap-2.5">
          <h2 className="text-[30px] font-semibold text-fgtext-contrast">Facility Capabilities</h2>
        </div>

        <Card className="w-full border-[#dfe3e6] shadow-md">
          <CardContent className="flex flex-col gap-4 p-5">
            {/* Uploads */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-semibold text-gray-800">Upload Images of Facility</label>
              <input ref={facilityImagesRef} type="file" multiple accept="image/*,application/pdf" className="h-12" />
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-semibold text-gray-800">Upload License/Accreditation Docs</label>
              <input ref={licenseRef} type="file" accept="application/pdf" className="h-12" />
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-semibold text-gray-800">Specialist Availability</label>
              <input ref={specialistRef} type="file" accept=".pdf,.xls,.xlsx" className="h-12" />
            </div>

            {/* Weekly Operating Days */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-semibold text-gray-800">Weekly Operating Days</label>
              <div className="flex flex-wrap gap-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <label key={day}>
                    <input
                      type="checkbox"
                      value={day}
                      checked={selectedDays.includes(day)}
                      onChange={handleCheckboxChange}
                    />{" "}
                    {day}
                  </label>
                ))}
              </div>
            </div>

            {/* Opening & Closing Time */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-semibold text-gray-800">Opening & Closing Time</label>
              <div className="flex gap-4">
                <Input
                  type="time"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="h-12 border border-gray-300"
                />
                <span>to</span>
                <Input
                  type="time"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  className="h-12 border border-gray-300"
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-semibold text-gray-800">Terms and Conditions</label>
              <label>
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />{" "}
                I Agree to the Terms and Conditions
              </label>
            </div>

            {/* Additional Info */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-semibold text-gray-800">Additional Information</label>
              <Input
                type="text"
                placeholder="Optional"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="h-12 border border-gray-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-5 w-full">
          <Button
            variant="outline"
            className="flex-1 h-12 bg-gray-100 rounded-xl text-sm font-semibold"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            className="flex-1 h-12 bg-primarysolid rounded-xl text-sm font-semibold text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Finish"}
          </Button>
        </div>
      </main>
    </div>
  );
}
