import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  Briefcase, 
  Settings, 
  Edit3,
  FileText,
  Download,
  Upload,
  Eye,
  BadgeCheck
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ProfileForm from './ProfileForm';
import { useSelector } from 'react-redux';

const Profile = () => {
  // Mock data based on your schema
  const {userState } = useSelector(s=>s.user);

  const [loading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  const handleResumeView = () => {
    if (userState.resume?.url) {
      window.open(userState.resume.url, '_blank');
    }
  };

  const handleResumeDownload = () => {
    if (userState.resume?.url) {
      const link = document.createElement('a');
      link.href = userState.resume.url;
      link.download = `${userState.name}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
                      <Briefcase className="w-4 h-4 mr-2" />
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
              {/* Resume Section */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Resume
                  </h2>
                </div>
                
                {!userState.resume?.url ? (
                  <Alert>
                    <Upload className="w-4 h-4" />
                    <AlertDescription>
                      No resume uploaded yet. Upload your resume to increase your chances of getting hired.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">Resume.pdf</h4>
                          <p className="text-sm text-slate-600">
                            Uploaded on {formatDate(userState.resume.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleResumeView}
                          className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={handleResumeDownload}
                          className="flex items-center space-x-1 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">
                      <p>Make sure your resume is up to date and highlights your key skills and experience.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Job Preferences Display */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Job Preferences
                  </h2>
                </div>
                
                {userState.jobPreferences.roles.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No preferred job roles set yet. Add your preferred roles to help employers find you.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Preferred Roles</h4>
                      <div className="flex flex-wrap gap-2">
                        {userState.jobPreferences.roles.map((role, index) => (
                          <span
                            key={index}
                            className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {userState.jobPreferences.salaryExpectation && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-700">Expected Salary</h4>
                        <p className="text-slate-600">${userState.jobPreferences.salaryExpectation.toLocaleString()} annually</p>
                      </div>
                    )}
                    
                    {userState.jobPreferences.locationPreference && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-700">Location Preference</h4>
                        <p className="text-slate-600">{userState.jobPreferences.locationPreference}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium text-slate-700">Work Preference</h4>
                      <p className="text-slate-600">
                        {userState.jobPreferences.remotePreferred ? 'Remote preferred' : 'Office-based preferred'}
                      </p>
                    </div>
                    
                    {userState.jobPreferences.noticePeriod && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-700">Notice Period</h4>
                        <p className="text-slate-600">{userState.jobPreferences.noticePeriod}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Account Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center mb-4">
                  <Clock className="w-5 h-5 mr-2" />
                  Account Activity
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-slate-500 mr-3" />
                      <span className="text-slate-600">Account Created</span>
                    </div>
                    <span className="text-slate-900 font-medium">
                      {formatDate(userState.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <div className="flex items-center">
                      <Settings className="w-4 h-4 text-slate-500 mr-3" />
                      <span className="text-slate-600">Last Updated</span>
                    </div>
                    <span className="text-slate-900 font-medium">
                      {formatDate(userState.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Completion */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Completion</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Basic Info</span>
                    <span className="text-green-600 font-medium">Complete</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Resume</span>
                    <span className={`font-medium ${userState.resume?.url ? 'text-green-600' : 'text-amber-600'}`}>
                      {userState.resume?.url ? 'Complete' : 'Missing'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${userState.resume?.url ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: userState.resume?.url ? '100%' : '0%' }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Job Preferences</span>
                    <span className={`font-medium ${userState.jobPreferences.roles.length > 0 ? 'text-green-600' : 'text-amber-600'}`}>
                      {userState.jobPreferences.roles.length > 0 ? 'Complete' : 'Incomplete'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${userState.jobPreferences.roles.length > 0 ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: userState.jobPreferences.roles.length > 0 ? '100%' : '25%' }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-600 mt-3">
                    Complete your profile to increase visibility to employers.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors">
                    View Applications
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors">
                    Update Resume
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors">
                    Notification Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;