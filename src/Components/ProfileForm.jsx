import React, { useEffect, useState } from "react";

const ProfileForm = () => {
  const [profileImage, setProfileImage] = useState("");
  const [preview, setPreview] = useState("");
  const [msg, setMsg] = useState("");

  // Fetch current profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data && data.profileImage) {
        setProfileImage(data.profileImage);
        setPreview(data.profileImage);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      // For simplicity, we use base64. For production, use FormData and file upload endpoint.
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const token = localStorage.getItem("token");
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ profileImage }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg("Profile updated successfully");
    } else {
      setMsg(data.msg || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Update Profile Image</h2>
      {msg && <p className="mb-2 text-green-600">{msg}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Profile Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <img
              src={preview}
              alt="Profile Preview"
              className="mt-4 w-32 h-32 object-cover rounded-full border"
            />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;