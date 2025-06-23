import React, { useState } from "react";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { Input } from "../../components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";

export function LaboratoryIs({ services, setServices, onNext, onBack }) {
  const [labData, setLabData] = useState({
    certificationBody: "",
    accreditationStatus: "",
    homeSampleCollection: "",
    turnaroundTime: "",
    hasCovidTest: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!labData.certificationBody) newErrors.certificationBody = "Required";
    if (!labData.accreditationStatus) newErrors.accreditationStatus = "Required";
    if (!labData.homeSampleCollection) newErrors.homeSampleCollection = "Required";
    if (!labData.turnaroundTime) newErrors.turnaroundTime = "Required";
    if (!labData.hasCovidTest) newErrors.hasCovidTest = "Required";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedServices = {
      ...services,
      laboratory: {
        ...labData,
      },
    };

    setErrors({});
    setServices(updatedServices);
    onNext(updatedServices);
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-center bg-white">
      {/* Header */}
      <header className="flex w-full h-20 items-center justify-between px-20 bg-bgdefault-bg">
        <div className="flex items-center">
          <h1 className="font-bold text-primarysolid text-4xl">Logo</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center gap-10 pt-10 px-4 w-full max-w-[768px]">
        {/* Section Title */}
        <div className="w-full space-y-2">
          <h2 className="text-[30px] font-semibold text-fgtext-contrast">Laboratory Information</h2>
          <p className="text-[16px] font-medium text-fgtext">Ensuring accuracy for patients, regulators, and partners.</p>
        </div>

        {/* Form Card */}
        <Card className="w-full border-[#dfe3e6] shadow-md">
          <CardContent className="flex flex-col gap-4 p-5">
            {/* Row 1: Upload & Certification Body */}
            <div className="flex flex-col md:flex-row gap-5 w-full">
              <div className="flex-1 flex flex-col gap-2.5">
                <label className="text-sm font-semibold text-gray-800">
                  List of Tests Conducted and Prices
                </label>
                <input type="file" className="h-12" />
              </div>
              <div className="flex-1 flex flex-col gap-2.5">
                <label className="text-sm font-semibold text-gray-800">Certification Body</label>
                <Input
                  placeholder="Enter certification body name"
                  className="h-12 rounded-md border border-gray-300"
                  value={labData.certificationBody}
                  onChange={(e) =>
                    setLabData((prev) => ({ ...prev, certificationBody: e.target.value }))
                  }
                />
                {errors.certificationBody && (
                  <p className="text-sm text-red-600">{errors.certificationBody}</p>
                )}
              </div>
            </div>

            {/* Row 2: Accreditation Status & Home Sample Collection */}
            <div className="flex flex-col md:flex-row gap-5 w-full">
              <div className="flex-1 flex flex-col gap-2.5">
                <label className="text-sm font-semibold text-gray-800">Accreditation Status</label>
                <Select
                  onValueChange={(val) =>
                    setLabData((prev) => ({ ...prev, accreditationStatus: val }))
                  }
                >
                  <SelectTrigger className="h-12 rounded-md border border-gray-300">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Awaiting">Awaiting</SelectItem>
                  </SelectContent>
                </Select>
                {errors.accreditationStatus && (
                  <p className="text-sm text-red-600">{errors.accreditationStatus}</p>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-2.5">
                <label className="text-sm font-semibold text-gray-800">Home Sample Collection</label>
                <Select
                  onValueChange={(val) =>
                    setLabData((prev) => ({ ...prev, homeSampleCollection: val }))
                  }
                >
                  <SelectTrigger className="h-12 rounded-md border border-gray-300">
                    <SelectValue placeholder="Yes / No" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
                {errors.homeSampleCollection && (
                  <p className="text-sm text-red-600">{errors.homeSampleCollection}</p>
                )}
              </div>
            </div>

            {/* Row 3: Turnaround Time & COVID-19 Test */}
            <div className="flex flex-col md:flex-row gap-5 w-full">
              <div className="flex-1 flex flex-col gap-2.5">
                <label className="text-sm font-semibold text-gray-800">Turnaround Time for Test Result</label>
                <Input
                  placeholder="e.g. 24 hours"
                  className="h-12 rounded-md border border-gray-300"
                  value={labData.turnaroundTime}
                  onChange={(e) =>
                    setLabData((prev) => ({ ...prev, turnaroundTime: e.target.value }))
                  }
                />
                {errors.turnaroundTime && (
                  <p className="text-sm text-red-600">{errors.turnaroundTime}</p>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-2.5">
                <label className="text-sm font-semibold text-gray-800">Availability of COVID-19 Test</label>
                <Select
                  onValueChange={(val) =>
                    setLabData((prev) => ({ ...prev, hasCovidTest: val }))
                  }
                >
                  <SelectTrigger className="h-12 rounded-md border border-gray-300">
                    <SelectValue placeholder="Yes / No" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
                {errors.hasCovidTest && (
                  <p className="text-sm text-red-600">{errors.hasCovidTest}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
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
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
}
