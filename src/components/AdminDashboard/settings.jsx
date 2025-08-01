import React, { useState, useEffect } from 'react';
import { User, Lock, Save, Eye, EyeOff, Settings, Phone, Mail, Shield } from 'lucide-react';
import { getCurrentAdmin, updateCurrentAdmin } from '../../services/admin';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load current admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await getCurrentAdmin();
        if (response.admin) {
          setProfileData({
            fullName: response.admin.fullName || '',
            email: response.admin.email || '',
            phone: response.admin.phone || ''
          });
        }
      } catch (err) {
        setError('Failed to load admin data');
        console.error('Error fetching admin data:', err);
      }
    };
    
    fetchAdminData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async () => {
    if (!profileData.fullName || !profileData.email || !profileData.phone) {
      setError('All fields are required');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await updateCurrentAdmin(profileData);
      setSuccess('Profile updated successfully!');
      
      // Update local state with response data if needed
      if (response.admin) {
        setProfileData({
          fullName: response.admin.fullName,
          email: response.admin.email,
          phone: response.admin.phone
        });
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMessage = err.message || err.error || 'Failed to update profile';
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!passwordData.currentPassword) {
      setError('Current password is required');
      setLoading(false);
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      await updateCurrentAdmin({ 
        password: passwordData.newPassword,
        currentPassword: passwordData.currentPassword
      });
      
      setSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMessage = err.message || err.error || 'Failed to update password';
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Admin Settings
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg px-4">
            Manage your profile and account settings
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 sm:mb-8 mx-2 sm:mx-0 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-sm flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
            <span className="font-medium text-sm sm:text-base">{success}</span>
          </div>
        )}
        
        {error && (
          <div className="mb-6 sm:mb-8 mx-2 sm:mx-0 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-sm flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
            <span className="font-medium text-sm sm:text-base">{error}</span>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl sm:rounded-2xl border border-white/20 mx-2 sm:mx-0 overflow-hidden">
          {/* Tab Navigation - Mobile Optimized */}
          <div className="border-b border-gray-100">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-4 sm:py-6 px-2 sm:px-8 text-xs sm:text-sm font-semibold border-b-2 sm:border-b-3 transition-all duration-200 ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-3">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-center leading-tight">
                    <span className="block sm:hidden">Profile</span>
                    <span className="hidden sm:block">Profile Information</span>
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 py-4 sm:py-6 px-2 sm:px-8 text-xs sm:text-sm font-semibold border-b-2 sm:border-b-3 transition-all duration-200 ${
                  activeTab === 'password'
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-3">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-center leading-tight">
                    <span className="block sm:hidden">Security</span>
                    <span className="hidden sm:block">Security Settings</span>
                  </span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Profile Information</h3>
                  <p className="text-gray-600 text-sm sm:text-base px-2">
                    Update your personal details and contact information
                  </p>
                </div>
                
                <div className="space-y-6 sm:space-y-8">
                  <div className="group">
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white shadow-sm text-sm sm:text-base"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        disabled={true}
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white shadow-sm text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        disabled={true}
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white shadow-sm text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="pt-4 sm:pt-6">
                    <button
                      onClick={handleProfileSubmit}
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 border border-transparent text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl text-white bg-primarysolid hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>{loading ? 'Saving Changes...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Security Settings</h3>
                  <p className="text-gray-600 text-sm sm:text-base px-2">
                    Update your password to keep your account secure
                  </p>
                </div>
                
                <div className="space-y-6 sm:space-y-8">
                  <div className="group">
                    <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 pr-12 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white shadow-sm text-sm sm:text-base"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 sm:right-4 top-3 sm:top-4 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 pr-12 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white shadow-sm text-sm sm:text-base"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 sm:right-4 top-3 sm:top-4 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </button>
                    </div>
                    <p className="mt-2 text-xs sm:text-sm text-gray-500">Password must be at least 8 characters long</p>
                  </div>

                  <div className="group">
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 pr-12 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white shadow-sm text-sm sm:text-base"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 sm:right-4 top-3 sm:top-4 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 sm:pt-6">
                    <button
                      onClick={handlePasswordSubmit}
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 border border-transparent text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>{loading ? 'Updating Password...' : 'Update Password'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;