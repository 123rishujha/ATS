import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  User,
  Plus,
  Save,
  X,
  Trash2,
  Upload,
  MapPin,
  DollarSign,
  Camera,
  FileText,
  HardDrive,
  Eye,
  Clock,
  IndianRupee,
} from "lucide-react";
import useS3Upload from "@/hooks/useS3Upload";
import { useUpdateProfileMutation } from "../JobSeekerQuery";
import { userLogin } from "@/redux/user/userSlice";
import { useDispatch } from "react-redux";

const ProfileForm = ({ userState, setIsEditing, onCancel }) => {
  const [filePreviewLink, setFilePreviewLink] = useState("");
  const [imagePreviewLink, setImagePreviewLink] = useState("");

  const dispatch = useDispatch();
  const [api, { isLoading: isSubmitting }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: userState.name,
      description: userState.description,
      email: userState.email,
      userPhoto: userState.userPhoto,
      description: userState.description,
      userResume: userState?.resume?.url,
      jobPreferences: {
        roles: userState.jobPreferences.roles || [],
        salaryExpectation: userState.jobPreferences.salaryExpectation || "",
        locationPreference: userState.jobPreferences.locationPreference || "",
        remotePreferred: userState.jobPreferences.remotePreferred || false,
        noticePeriod: userState.jobPreferences.noticePeriod || "",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "jobPreferences.roles",
  });
  const { handleUploadFileS3 } = useS3Upload();

  const addRole = () => {
    append("");
  };

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

  const handleResumeUpload = async (e) => {
    const files = e.target.files;
    if (files?.length > 0) {
      const filePreview = document.getElementById("file-preview");
      if (filePreview) {
        filePreview.classList.remove("hidden");
      }
      try {
        const res = await handleUploadFileS3(files[0], "resume");
        if (res?.previewLink) {
          setFilePreviewLink(res.previewLink);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  const handleRemoveFile = () => {
    const filePreview = document.getElementById("file-preview");
    if (filePreview) {
      filePreview.classList.add("hidden");
    }
  };

  const innerSumbmit = async (data) => {
    let body = {
      name: data.name,
      userPhoto: imagePreviewLink,
      email: data.email,
      description: data.description,
      jobPreferences: {
        roles: data.jobPreferences.roles,
        salaryExpectation: data.jobPreferences.salaryExpectation,
        locationPreference: data.jobPreferences.locationPreference,
        remotePreferred: data.jobPreferences.remotePreferred,
        noticePeriod: data.jobPreferences.noticePeriod,
      },
    };
    if (filePreviewLink) {
      body["resume"] = {
        url: filePreviewLink,
        uploadedAt: new Date().toISOString(),
      };
    }
    const res = await api({
      body: body,
    });
    if (res?.data?.data) {
      console.log("ajklf data", res?.data?.data);
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
            onClick={handleSubmit(innerSumbmit)}
            disabled={isSubmitting}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Saving..." : "Save"}</span>
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

      <form onSubmit={handleSubmit(innerSumbmit)} className="space-y-6">
        {/* Profile Photo */}
        <div className="flex items-center space-x-6 pb-6 border-b">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center overflow-hidden">
              {/* Profile photo preview - replace with actual image when uploaded */}
              {imagePreviewLink ? (
                <img
                  src={imagePreviewLink}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Profile Photo
            </h3>
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <span className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              disabled={true}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            {...register("description", {
              required: "Bio is required",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell something about yourself"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Job Preferences */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Job Preferences
          </h3>

          {/* Preferred Roles */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Preferred Job Roles
              </label>
              <button
                type="button"
                onClick={addRole}
                className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Role
              </button>
            </div>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <input
                    {...register(`jobPreferences.roles.${index}`, {
                      required: "Role cannot be empty",
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Frontend Developer"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {fields.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No roles added yet. Click "Add Role" to get started.
                </p>
              )}
            </div>
          </div>

          {/* Salary and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IndianRupee className="w-4 h-4 inline mr-1" />
                Expected Salary (Annual)
              </label>
              <input
                {...register("jobPreferences.salaryExpectation", {
                  min: { value: 0, message: "Salary must be positive" },
                })}
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 80000"
              />
              {errors.jobPreferences?.salaryExpectation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.jobPreferences.salaryExpectation.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location Preference
              </label>
              <input
                {...register("jobPreferences.locationPreference")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., New York, Remote"
              />
            </div>
          </div>

          {/* Remote Work and Notice Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  {...register("jobPreferences.remotePreferred")}
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Prefer Remote Work
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Check if you prefer working remotely
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Notice Period
              </label>
              <select
                {...register("jobPreferences.noticePeriod")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select notice period</option>
                <option value="Immediate">Immediate</option>
                <option value="15 days">15 days</option>
                <option value="30 days">30 days</option>
                <option value="60 days">60 days</option>
                <option value="90 days">90 days</option>
              </select>
            </div>
          </div>

          {/* Enhanced Resume Upload */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              <FileText className="w-4 h-4 inline mr-1" />
              Resume
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleResumeUpload}
              />
              <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-8 text-center transition-colors group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-50 group-hover:bg-blue-100 rounded-full flex items-center justify-center mb-4 transition-colors">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Upload your resume
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Drag and drop your file here, or{" "}
                    <span className="text-blue-600 font-medium">browse</span>
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      PDF, DOC, DOCX
                    </span>
                    <span className="flex items-center">
                      <HardDrive className="w-3 h-3 mr-1" />
                      Max 5MB
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* File Preview Area */}
            <div
              className="mt-4 p-4 bg-gray-50 rounded-lg border hidden"
              id="file-preview"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      resume.pdf
                    </p>
                    <p className="text-xs text-gray-500">2.4 MB</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
