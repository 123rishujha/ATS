import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Save,
  X,
  Camera,
  Building,
  Globe,
  MapPin,
  FileText
} from 'lucide-react';
import useS3Upload from '@/hooks/useS3Upload';
import { useUpdateProfileMutation } from '../RecruiterQuery';
import { userLogin } from '@/redux/user/userSlice';
import { useDispatch } from 'react-redux';

const ProfileForm = ({ 
  userState, 
  setIsEditing, 
  onCancel, 
}) => {
  const [imagePreviewLink, setImagePreviewLink] = useState("");
  const dispatch = useDispatch();
  const [api, { isLoading: isSubmitting }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userState.name,
      description: userState.description,
      email: userState.email,
      userPhoto: userState.userPhoto,
      company: {
        name: userState.company?.name || '',
        website: userState.company?.website || '',
        location: userState.company?.location || '',
        description: userState.company?.description || '',
      }
    }
  });

  const { handleUploadFileS3 } = useS3Upload();

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (files?.length > 0) {
      try {
        const res = await handleUploadFileS3(files[0], "photo");
        if (res?.previewLink) {
          setImagePreviewLink(res.previewLink);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  const innerSubmit = async (data) => {
    let body = {
      name: data.name,
      email: data.email,
      description: data.description,
      company: {
        name: data.company.name,
        website: data.company.website,
        location: data.company.location,
        description: data.company.description,
      }
    };
    
    if (imagePreviewLink) {
      body['userPhoto'] = imagePreviewLink;
    }
    
    const res = await api({
      body: body
    });
    
    if (res?.data?.data) {
      dispatch(userLogin(res?.data?.data));
    }
    
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleSubmit(innerSubmit)}
            disabled={isSubmitting}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : 'Save'}</span>
          </button>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(innerSubmit)} className="space-y-6">
        {/* Profile Photo */}
        <div className="flex items-center space-x-6 pb-6 border-b">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center overflow-hidden">
              {imagePreviewLink ? (
                <img src={imagePreviewLink} alt="Profile" className="w-full h-full object-cover" />
              ) : userState.userPhoto ? (
                <img src={userState.userPhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-colors cursor-pointer">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Photo</h3>
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <span className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                  Upload Photo
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG, GIF up to 2MB. Recommended size: 400x400px
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                disabled
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Bio / Summary
              </label>
              <textarea
                id="description"
                rows={3}
                {...register("description")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="A brief description about yourself"
              />
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2 flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Company Information
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="company.name" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                id="company.name"
                type="text"
                {...register("company.name", { required: "Company name is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.company?.name && (
                <p className="mt-1 text-sm text-red-600">{errors.company.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="company.website" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                Company Website
              </label>
              <input
                id="company.website"
                type="url"
                {...register("company.website", { 
                  pattern: {
                    value: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](\.[a-zA-Z]{2,})+/,
                    message: "Invalid URL format"
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
              {errors.company?.website && (
                <p className="mt-1 text-sm text-red-600">{errors.company.website.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="company.location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Company Location
              </label>
              <input
                id="company.location"
                type="text"
                {...register("company.location")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="City, Country"
              />
            </div>
            <div>
              <label htmlFor="company.description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                Company Description
              </label>
              <textarea
                id="company.description"
                rows={4}
                {...register("company.description")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us about your company, its mission, values, and culture"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
