import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Info, Upload, Check, Trash2, AlertTriangle, Edit, X, CheckCircle, Power, PowerOff, MessageCircle, RotateCcw } from "lucide-react";
import Select from "react-select";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { Input } from "../../components/input";
import { Checkbox } from "../../components/checkbox";
import { Label } from "../../components/label";
import { Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/select";
import { Textarea } from "../../components/textArea";
import {
  getFacilityById,
  verifyFacility,
  deactivateFacility,
  reactivateFacility,
  deleteFacility,
  recoverFacility // Add this import
} from "../../services/facility";


import { CoreClinicalSpecialities } from "../enums/medicalSpecialities";
import { useAuth } from "../hook/auth";
import { FacilityInformation } from "../FacilityDashboard/facilityInformation";
import FacilityServiceComponent from "./services";
import { HospitalServices } from "../FacilityDashboard/hospitalServices";
import { FacilityDoc } from "./facilitydocs";
import FacilityInfo from "./facilityInfo";
import {
  message,
} from "antd";

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default", // default, danger, warning, success
  loading = false,
  children
}) => {
  if (!isOpen) return null;

  const getButtonStyles = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">{message}</p>
          {children}
        </div>

        <div className="flex space-x-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            className={getButtonStyles()}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

const FacilityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminAccessType } = useAuth();
  const [facility, setFacility] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [modals, setModals] = useState({
    verify: { open: false, notes: '' },
    deactivate: { open: false, reason: '' },
    reactivate: { open: false, notes: '' },
    delete: { open: false, hardDelete: false },
    recover: { open: false },
    permanentDelete: { open: false },
    chat: { open: false }
  });

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

  // Utility function to close all modals
  const closeAllModals = () => {
    setModals({
      verify: { open: false, notes: '' },
      deactivate: { open: false, reason: '' },
      reactivate: { open: false, notes: '' },
      delete: { open: false, hardDelete: false },
      recover: { open: false },
      permanentDelete: { open: false },
      chat: { open: false }
    });
  };

  // Refresh facility data
  const refreshFacility = async () => {
    try {
      const response = await getFacilityById(id);
      setFacility(response);
    } catch (err) {
      console.error("Failed to refresh facility details", err);
    }
  };

  // Handle Chat
  const handleChat = () => {
    navigate(`/admin-dashboard/conversations/${id}`);
  };

  // Handle Verify
  const handleVerify = () => {
    setModals(prev => ({ ...prev, verify: { ...prev.verify, open: true } }));
  };

  const confirmVerify = async () => {
    setLoading(true);
    try {
      await verifyFacility(id, modals.verify.notes || null);
      await refreshFacility();
      closeAllModals();
      message.success('Facility verified successfully!');
    } catch (error) {
      console.error('Error verifying facility:', error);
      message.error('Failed to verify facility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Deactivate
  const handleDeactivate = () => {
    setModals(prev => ({ ...prev, deactivate: { ...prev.deactivate, open: true } }));
  };

  const confirmDeactivate = async () => {
    setLoading(true);
    try {
      await deactivateFacility(id, modals.deactivate.reason || null);
      await refreshFacility();
      closeAllModals();
      message.success('Facility deactivated successfully!');
    } catch (error) {
      console.error('Error deactivating facility:', error);
      message.error('Failed to deactivate facility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Reactivate
  const handleReactivate = () => {
    setModals(prev => ({ ...prev, reactivate: { ...prev.reactivate, open: true } }));
  };

  const confirmReactivate = async () => {
    setLoading(true);
    try {
      await reactivateFacility(id, modals.reactivate.notes || null);
      await refreshFacility();
      closeAllModals();
      message.success('Facility reactivated successfully!');
    } catch (error) {
      console.error('Error reactivating facility:', error);
      message.error('Failed to reactivate facility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = () => {
    setModals(prev => ({ ...prev, delete: { ...prev.delete, open: true } }));
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await deleteFacility(id, modals.delete.hardDelete);
      closeAllModals();

      if (modals.delete.hardDelete) {
        message.success('Facility permanently deleted!');
        navigate('/facilities'); // Navigate back to facilities list
      } else {
        message.success('Facility soft deleted successfully!');
        await refreshFacility();
      }
    } catch (error) {
      console.error('Error deleting facility:', error);
      message.error('Failed to delete facility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Recover
  const handleRecover = () => {
    setModals(prev => ({ ...prev, recover: { open: true } }));
  };

  const confirmRecover = async () => {
    setLoading(true);
    try {
      await recoverFacility(id);
      await refreshFacility();
      closeAllModals();
      message.success('Facility recovered successfully!');
    } catch (error) {
      console.error('Error recovering facility:', error);
      message.error('Failed to recover facility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Permanent Delete
  const handlePermanentDelete = () => {
    setModals(prev => ({ ...prev, permanentDelete: { open: true } }));
  };

  const confirmPermanentDelete = async () => {
    setLoading(true);
    try {
      await deleteFacility(id, true); // true for hard delete
      closeAllModals();
      message.success('Facility permanently deleted!');
      navigate('/admin-dashboard/facilities'); // Navigate back to facilities list
    } catch (error) {
      console.error('Error permanently deleting facility:', error);
      message.error('Failed to permanently delete facility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    console.log("Edit mode:", !isEditing);
  };

  // Determine which buttons to show based on facility status
  const getActionButtons = () => {
    if (!facility) return [];

    const status = facility.status?.toLowerCase();
    const buttons = [];

    // If facility is deleted, only show recover and permanent delete buttons
    if (status === 'deleted') {
      buttons.push(
        <Button
          key="recover"
          variant="outline"
          size="sm"
          onClick={handleRecover}
          className="flex items-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Recover Facility</span>
        </Button>
      );

      // Add permanent delete button for soft-deleted facilities
      if (adminAccessType !== 'editor') {
        buttons.push(
          <Button
            key="permanentDelete"
            variant="outline"
            size="sm"
            onClick={handlePermanentDelete}
            className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Permanently</span>
          </Button>
        );
      }

      return buttons;
    }

    // Chat button - always show for non-deleted facilities
    buttons.push(
      <Button
        key="chat"
        variant="outline"
        size="sm"
        onClick={handleChat}
        className="flex items-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Chat</span>
      </Button>
    );

    // Verify button - show if not verified
    if (status !== 'verified' && adminAccessType !== 'editor') {
      buttons.push(
        <Button
          key="verify"
          variant="outline"
          size="sm"
          onClick={handleVerify}
          className="flex items-center space-x-2 text-green-600 border-green-200 hover:bg-green-50"
        >
          <Check className="w-4 h-4" />
          <span>Verify</span>
        </Button>
      );
    }

    // Deactivate/Reactivate button
    if (status === 'deactivated' && adminAccessType !== 'editor') {
      buttons.push(
        <Button
          key="reactivate"
          variant="outline"
          size="sm"
          onClick={handleReactivate}
          className="flex items-center space-x-2 text-green-600 border-green-200 hover:bg-green-50"
        >
          <Power className="w-4 h-4" />
          <span>Reactivate</span>
        </Button>
      );
    } else if (status !== 'deleted' && adminAccessType !== 'editor') {
      buttons.push(
        <Button
          key="deactivate"
          variant="outline"
          size="sm"
          onClick={handleDeactivate}
          className="flex items-center space-x-2 text-yellow-600 border-yellow-200 hover:bg-yellow-50"
        >
          <PowerOff className="w-4 h-4" />
          <span>Deactivate</span>
        </Button>
      );
    }

    // Delete button - show for all except already deleted
    if (status !== 'deleted' && adminAccessType !== 'editor') {
      buttons.push(
        <Button
          key="delete"
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </Button>
      );
    }

    return buttons;
  };

  if (!facility) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{facility.name}</h1>
                  <p className="text-sm text-gray-500">Facility ID: {facility._id}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${facility.status === 'Active' || facility.status === 'Verified'
                ? 'bg-green-100 text-green-800'
                : facility.status === 'Deactivated'
                  ? 'bg-red-100 text-red-800'
                  : facility.status === 'Deleted'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                {facility.status?.charAt(0).toUpperCase() + facility.status?.slice(1) || 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto space-y-8">
        {/* Show different content based on facility status */}
        {facility.status?.toLowerCase() === 'deleted' ? (
          // Show deleted facility info
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Facility Deleted</h3>
                <p className="text-gray-600 mb-4">
                  This facility has been soft deleted. You can recover it or permanently delete it using the buttons below.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p><strong>Facility Name:</strong> {facility.name}</p>
                  <p><strong>Type:</strong> {facility.type}</p>
                  <p><strong>Email:</strong> {facility.email}</p>
                  {facility.deletedAt && (
                    <p><strong>Deleted At:</strong> {new Date(facility.deletedAt).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Show normal facility content
          <>
            {/* Facility Information Section */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Facility Information</h3>
                  <div className="w-12 h-0.5 bg-blue-500"></div>
                </div>
                <FacilityInfo facilityId={id} />
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Services</h3>
                  <div className="w-12 h-0.5 bg-green-500"></div>
                </div>
                <FacilityServiceComponent facilityId={id} />
              </CardContent>
            </Card>

            {/* Documents Section */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Documents</h3>
                  <div className="w-12 h-0.5 bg-orange-500"></div>
                </div>
                <FacilityDoc facilityId={id} />
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              {getActionButtons()}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}

      {/* Verify Modal */}
      <ConfirmationModal
        isOpen={modals.verify.open}
        onClose={closeAllModals}
        onConfirm={confirmVerify}
        title="Verify Facility"
        message={`Are you sure you want to verify "${facility.name}"?`}
        confirmText="Verify Facility"
        type="success"
        loading={loading}
      />

      {/* Deactivate Modal */}
      <ConfirmationModal
        isOpen={modals.deactivate.open}
        onClose={closeAllModals}
        onConfirm={confirmDeactivate}
        title="Deactivate Facility"
        message={`Are you sure you want to deactivate "${facility.name}"? This will prevent the facility from being accessible to users.`}
        confirmText="Deactivate Facility"
        type="warning"
        loading={loading}
      >
        <div>
          <Label htmlFor="deactivationReason">Reason for Deactivation (Optional)</Label>
          <Textarea
            id="deactivationReason"
            placeholder="Enter reason for deactivation..."
            value={modals.deactivate.reason}
            onChange={(e) => setModals(prev => ({
              ...prev,
              deactivate: { ...prev.deactivate, reason: e.target.value }
            }))}
            className="mt-2"
          />
        </div>
      </ConfirmationModal>

      {/* Reactivate Modal */}
      <ConfirmationModal
        isOpen={modals.reactivate.open}
        onClose={closeAllModals}
        onConfirm={confirmReactivate}
        title="Reactivate Facility"
        message={`Are you sure you want to reactivate "${facility.name}"?`}
        confirmText="Reactivate Facility"
        type="success"
        loading={loading}
      >
        <div>
          <Label htmlFor="reactivationNotes">Reactivation Notes (Optional)</Label>
          <Textarea
            id="reactivationNotes"
            placeholder="Add any notes about the reactivation..."
            value={modals.reactivate.notes}
            onChange={(e) => setModals(prev => ({
              ...prev,
              reactivate: { ...prev.reactivate, notes: e.target.value }
            }))}
            className="mt-2"
          />
        </div>
      </ConfirmationModal>

      {/* Delete Modal */}
      <ConfirmationModal
        isOpen={modals.delete.open}
        onClose={closeAllModals}
        onConfirm={confirmDelete}
        title="Delete Facility"
        message={`Are you sure you want to delete "${facility.name}"?`}
        confirmText="Delete Facility"
        type="danger"
        loading={loading}
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This action cannot be undone easily. Please choose carefully.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hardDelete"
              checked={modals.delete.hardDelete}
              onCheckedChange={(checked) => setModals(prev => ({
                ...prev,
                delete: { ...prev.delete, hardDelete: checked }
              }))}
            />
            <Label htmlFor="hardDelete" className="text-sm">
              Permanently delete (cannot be recovered)
            </Label>
          </div>

          <p className="text-xs text-gray-600">
            {modals.delete.hardDelete
              ? "The facility will be permanently removed from the database."
              : "The facility will be marked as deleted but can be recovered by an administrator."
            }
          </p>
        </div>
      </ConfirmationModal>

      {/* Recover Modal */}
      <ConfirmationModal
        isOpen={modals.recover.open}
        onClose={closeAllModals}
        onConfirm={confirmRecover}
        title="Recover Facility"
        message={`Are you sure you want to recover "${facility.name}"? This will restore the facility to active status.`}
        confirmText="Recover Facility"
        type="success"
        loading={loading}
      >
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> The facility will be restored to "Active" status and will be accessible again.
          </p>
        </div>
      </ConfirmationModal>

      {/* Permanent Delete Modal */}
      <ConfirmationModal
        isOpen={modals.permanentDelete.open}
        onClose={closeAllModals}
        onConfirm={confirmPermanentDelete}
        title="Permanently Delete Facility"
        message={`Are you sure you want to permanently delete "${facility.name}"?`}
        confirmText="Delete Permanently"
        type="danger"
        loading={loading}
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              <strong>⚠️ CRITICAL WARNING:</strong> This action is irreversible and will permanently remove all facility data from the database.
            </p>
          </div>


          <p className="text-xs text-red-600 font-medium">
            Once deleted, this facility cannot be recovered by any means.
          </p>
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default FacilityDetail;