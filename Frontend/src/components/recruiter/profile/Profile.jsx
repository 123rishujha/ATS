import React, { useState, useMemo } from 'react';
import { 
  User, 
  Mail, 
  Building, 
  Globe, 
  MapPin, 
  Settings, 
  Edit3,
  FileText,
  BadgeCheck
} from 'lucide-react';
import ProfileForm from './ProfileForm';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { userState } = useSelector(s => s.user);
  const [loading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Calculate profile completion percentage
  const profileCompletionPercentage = useMemo(() => {
    // Define fields to check
    const basicFields = [
      userState.name,
      userState.email,
      userState.userPhoto,
      userState.description
    ];
    
    const companyFields = [
      userState.company?.name,
      userState.company?.website,
      userState.company?.location,
      userState.company?.description
    ];
    
    // Count filled fields
    const filledBasicFields = basicFields.filter(field => field && String(field).trim() !== '').length;
    const filledCompanyFields = companyFields.filter(field => field && String(field).trim() !== '').length;
    
    // Calculate percentage
    const totalFields = basicFields.length + companyFields.length;
    const filledFields = filledBasicFields + filledCompanyFields;
    const percentage = Math.round((filledFields / totalFields) * 100);
    
    return percentage;
  }, [userState]);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
          <div className="px-6 py-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {userState.userPhoto ? <img src={userState.userPhoto} alt="User" className="w-full h-full object-cover rounded-full" /> : getInitials(userState.name)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{userState.name}</h1>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center text-slate-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{userState.email}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <BadgeCheck className="w-4 h-4 mr-2" />
                      <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {userState.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <BadgeCheck className="w-4 h-4 mr-2" />
                    <span>{userState.description}</span>
                  </div>
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <ProfileForm
            userState={userState}
            onCancel={handleCancel}
            setIsEditing={setIsEditing}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Company Information */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Company Information
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500 mb-1">Company Name</p>
                      <p className="font-medium text-slate-900">{userState.company?.name || 'Not specified'}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500 mb-1">Company Website</p>
                      <p className="font-medium text-slate-900 flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-blue-600" />
                        {userState.company?.website ? (
                          <a href={userState.company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {userState.company.website}
                          </a>
                        ) : (
                          'Not specified'
                        )}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500 mb-1">Company Location</p>
                      <p className="font-medium text-slate-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                        {userState.company?.location || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500 mb-2">Company Description</p>
                    <p className="text-slate-900">
                      {userState.company?.description || 'No company description provided.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Stats */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Profile Completion</span>
                    <span className="font-medium text-slate-900">{profileCompletionPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${profileCompletionPercentage}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>My Job Postings</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Account Settings</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
