import React, { useEffect, useState } from "react";
import { getFacilityById } from "../../services/facility";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Building, 
  User, 
  Calendar,
  Clock,
  Users,
  Shield,
  AlertCircle,
  MessageSquare,
  Hash,
  Camera,
  CheckCircle,
  XCircle,
  Loader
} from "lucide-react";

const FacilityInfo = ({ facilityId }) => {
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacility = async () => {
      if (!facilityId) {
        setError(new Error("Facility ID is required"));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getFacilityById(facilityId);
        console.log(response, "facility info response");
        setFacility(response);
      } catch (err) {
        setError(err);
        console.error("Failed to fetch facility details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacility();
  }, [facilityId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getVerificationIcon = (isVerified) => {
    return isVerified ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  const InfoCard = ({ icon: Icon, title, value, className = "", isVerified = null }) => (
    <div className={`p-4 bg-gray-50 rounded-lg border ${className}`}>
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-gray-600" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-600">{title}</p>
            {isVerified !== null && getVerificationIcon(isVerified)}
          </div>
          <p className="font-medium text-gray-900">{value || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-gray-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-700">Error: {error.message}</p>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
        <p className="text-yellow-700">No facility information found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
   

      {/* Basic Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facility.type && (
            <InfoCard 
              icon={Building} 
              title="Facility Type" 
              value={facility.type || facility.hospitalType} 
            />
          )}
          {facility.registrationNumber && (
            <InfoCard 
              icon={Hash} 
              title="Registration Number" 
              value={facility.registrationNumber} 
            />
          )}
            <InfoCard 
            icon={Calendar} 
            title="Created At" 
            value={formatDate(facility.createdAt)} 
          />
          {facility.phone && (
            <InfoCard 
              icon={Phone} 
              title="Phone Number" 
              value={facility.phone} 
              isVerified={facility.isPhoneVerified}
            />
          )}
          {facility.whatsapp && (
            <InfoCard 
              icon={MessageSquare} 
              title="WhatsApp" 
              value={facility.whatsapp} 
              isVerified={facility.isWhatsappNumberVerified}
            />
          )}
          {facility.secondaryPhone && (
            <InfoCard 
              icon={Phone} 
              title="Secondary Phone" 
              value={facility.secondaryPhone} 
            />
          )}
          {facility.email && (
            <InfoCard 
              icon={Mail} 
              title="Email" 
              value={facility.email} 
            />
          )}
          {facility.website && (
            <InfoCard 
              icon={Globe} 
              title="Website" 
              value={facility.website} 
            />
          )}
          {facility.insuranceType && (
            <InfoCard 
              icon={Shield} 
              title="Insurance Type" 
              value={facility.insuranceType} 
            />
          )}
          {facility.state && (
            <InfoCard 
              icon={MapPin} 
              title="State" 
              value={facility.state} 
            />
          )}
          {facility.lga && (
            <InfoCard 
              icon={MapPin} 
              title="LGA" 
              value={facility.lga} 
            />
          )}
          {facility.lcda && (
            <InfoCard 
              icon={MapPin} 
              title="LCDA" 
              value={facility.lcda} 
            />
          )}
            {facility.address && (
            <InfoCard 
              icon={MapPin} 
              title="Address" 
              value={facility.address} 
            />
          )}
        </div>
      </div>


  

 
    </div>
  );
};

export default FacilityInfo;