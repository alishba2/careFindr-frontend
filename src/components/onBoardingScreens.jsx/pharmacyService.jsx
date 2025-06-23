import { UploadIcon, Plus } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { Checkbox } from "../../components/checkbox";
import { Input } from "../../components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";

export const PharmacyIsSelected = ({ onNext, onBack, setServices, services }) => {
  const [branchAddress, setBranchAddress] = useState("");
  const [formData, setFormData] = useState({
    delivery: "",
    licensedPharmacist: "",
    startTime: "",
    endTime: "",
    complianceDocuments: {
      pcnLicense: false,
      nafdacCert: false,
      cac: false,
    },
    acceptedPayments: {
      nhis: false,
      hmo: false,
      insuranceCards: false,
      discountsBulkPricing: false,
    },
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!branchAddress.trim()) {
      newErrors.branchAddress = "Branch address is required.";
    }
    if (!formData.delivery) {
      newErrors.delivery = "Delivery option is required.";
    }
    if (!formData.licensedPharmacist) {
      newErrors.licensedPharmacist = "Licensed pharmacist status is required.";
    }
    if (!formData.startTime || !formData.endTime) {
      newErrors.businessHours = "Business hours are required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextClick = () => {
    if (!validate()) return;

    console.log(formData, "formdata");
    const updatedServices = {
      ...services,
      pharmacy: {
        branchAddress,
        ...formData,

      },
    };

    console.log(updatedServices, "updated services");
    setServices(updatedServices);
    onNext(updatedServices);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (section, field) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field],
      },
    }));
  };

  return (
    <div className="flex flex-col w-full items-center bg-white">
      <header className="w-full h-20 flex items-center justify-between px-20 bg-bgdefault-bg">
        <div className="text-4xl font-bold text-primarysolid">Logo</div>
      </header>

      <main className="flex flex-col items-center gap-10 px-0 py-10 w-full">
        <div className="w-[768px] flex flex-col items-center gap-10">
          <div className="w-full">
            <h1 className="text-[30px] font-semibold text-fgtext-contrast">Pharmacy Services</h1>
          </div>

          <Card className="w-full border-[#dfe3e6] shadow-box-shadow-shadow">
            <CardContent className="flex flex-col gap-6 p-5">
              {/* Branch Address */}
              <div className="flex flex-col gap-4">
                <label className="font-semibold text-sm text-fgtext-contrast">Branch Address</label>
                <Input
                  value={branchAddress}
                  onChange={(e) => setBranchAddress(e.target.value)}
                  placeholder="Enter your branch address"
                  className="h-12 border-[#d7dbdf]"
                />
                {errors.branchAddress && (
                  <p className="text-red-500 text-sm">{errors.branchAddress}</p>
                )}
              </div>

              {/* Delivery and Pharmacist */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="font-semibold text-sm text-fgtext-contrast">Do you offer delivery?</label>
                  <Select
                    value={formData.delivery}
                    onValueChange={(val) => handleChange("delivery", val)}
                  >
                    <SelectTrigger className="h-12 border-[#d7dbdf]">
                      <SelectValue placeholder="Yes / No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.delivery && <p className="text-red-500 text-sm">{errors.delivery}</p>}
                </div>

                <div className="flex-1">
                  <label className="font-semibold text-sm text-fgtext-contrast">
                    Do you have a licensed pharmacist on-site?
                  </label>
                  <Select
                    value={formData.licensedPharmacist}
                    onValueChange={(val) => handleChange("licensedPharmacist", val)}
                  >
                    <SelectTrigger className="h-12 border-[#d7dbdf]">
                      <SelectValue placeholder="Yes / No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.licensedPharmacist && (
                    <p className="text-red-500 text-sm">{errors.licensedPharmacist}</p>
                  )}
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="font-semibold text-sm text-fgtext-contrast">Business Hours</label>
                  <div className="flex gap-4">
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleChange("startTime", e.target.value)}
                      className="h-12 border-[#d7dbdf]"
                      placeholder="Start Time"
                    />
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleChange("endTime", e.target.value)}
                      className="h-12 border-[#d7dbdf]"
                      placeholder="End Time"
                    />
                  </div>
                  {errors.businessHours && (
                    <p className="text-red-500 text-sm">{errors.businessHours}</p>
                  )}
                </div>
              </div>

              {/* Compliance Documents */}
              <div>
                <label className="font-semibold text-sm text-fgtext-contrast">Compliance Documents</label>
                <div className="flex flex-row gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.complianceDocuments.pcnLicense}
                      onCheckedChange={() =>
                        handleCheckboxChange("complianceDocuments", "pcnLicense")
                      }
                    />
                    <span className="text-sm text-fgtext">PCN License</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.complianceDocuments.nafdacCert}
                      onCheckedChange={() =>
                        handleCheckboxChange("complianceDocuments", "nafdacCert")
                      }
                    />
                    <span className="text-sm text-fgtext">NAFDAC Cert.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.complianceDocuments.cac}
                      onCheckedChange={() =>
                        handleCheckboxChange("complianceDocuments", "cac")
                      }
                    />
                    <span className="text-sm text-fgtext">CAC</span>
                  </div>
                </div>
              </div>

              {/* Accepted Payments */}
              <div>
                <label className="font-semibold text-sm text-fgtext-contrast">Accepted Payments</label>
                <div className="flex flex-row gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.acceptedPayments.nhis}
                      onCheckedChange={() => handleCheckboxChange("acceptedPayments", "nhis")}
                    />
                    <span className="text-sm text-fgtext">NHIS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.acceptedPayments.hmo}
                      onCheckedChange={() => handleCheckboxChange("acceptedPayments", "hmo")}
                    />
                    <span className="text-sm text-fgtext">HMO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.acceptedPayments.insuranceCards}
                      onCheckedChange={() => handleCheckboxChange("acceptedPayments", "insuranceCards")}
                    />
                    <span className="text-sm text-fgtext">Insurance cards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.acceptedPayments.discountsBulkPricing}
                      onCheckedChange={() => handleCheckboxChange("acceptedPayments", "discountsBulkPricing")}
                    />
                    <span className="text-sm text-fgtext">Discounts/Bulk pricing</span>
                  </div>
                </div>
              </div>

              {/* Drug List Upload */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="font-semibold text-sm text-fgtext-contrast">Upload Drug List (Price Catalog)</label>
                  <Input
                    type="file"
                    className="h-12 border-[#d7dbdf]"
                    onChange={(e) => handleChange("drugList", e.target.files[0])}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex gap-5 w-full">
            <Button
              variant="outline"
              className="h-12 flex-1 bg-bgbg-hover rounded-xl font-semibold"
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              className="h-12 flex-1 bg-primarysolid rounded-xl font-semibold text-white"
              onClick={handleNextClick}
            >
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
