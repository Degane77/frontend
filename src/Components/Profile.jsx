import { useState, useEffect } from "react";
import axios from "axios";
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit3, FiSave, FiX } from "react-icons/fi";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/profiles/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProfile(response.data);
      setFormData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading profile:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/profiles`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProfile(response.data);
      setIsEditing(false);
      setSaving(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Access</h2>
            <p className="text-gray-600 mb-6">Please login to view your profile</p>
            <button 
              onClick={() => window.location.href = "/login"}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <FiUser className="text-3xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{profile?.fullName || "User Profile"}</h1>
                  <p className="text-blue-100 text-lg">{profile?.email || user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-3 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-all"
              >
                {isEditing ? <FiX className="text-2xl" /> : <FiEdit3 className="text-2xl" />}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FiSave className="text-lg" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <FiX className="text-lg" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FiUser className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Full Name</h3>
                        <p className="text-gray-600">{profile?.fullName || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <FiMail className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Email</h3>
                        <p className="text-gray-600">{profile?.email || user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                        <FiPhone className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Phone Number</h3>
                        <p className="text-gray-600">{profile?.phone || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <FiMapPin className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Location</h3>
                        <p className="text-gray-600">{profile?.location || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {profile?.bio && (
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-gray-800 mb-3">Bio</h3>
                    <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600 font-medium">User ID:</span>
                      <p className="text-blue-800">{user._id}</p>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Member Since:</span>
                      <p className="text-blue-800">
                        {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
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

export default Profile;