import React from "react";
import { Button } from "../../components/button";

export const ServiceDetailsSection = () => {
  return (
    <div className="flex items-start gap-5 w-full">
      <Button
        variant="outline"
        className="flex-1 h-12 bg-bgbg-hover text-fgtext-contrast font-input-medium-semi-bold rounded-xl"
      >
        Back
      </Button>

      <Button className="flex-1 h-12 bg-primarysolid text-primaryon-primary font-input-medium-semi-bold rounded-xl">
        Next
      </Button>
    </div>
  );
};
