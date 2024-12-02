import React, { useState, useEffect } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const Profile = ({ user }) => {
  const [profile, setProfile] = useState(null); // Profile data
  const [editing, setEditing] = useState(false); // Toggle between view/edit mode
  const [formData, setFormData] = useState({}); // Form data for editing
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
            setFormData(docSnap.data()); // Initialize form data for editing
          } else {
            console.error("No profile found for this user.");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleEdit = () => setEditing(true); // Enter edit mode
  const handleCancel = () => {
    setEditing(false);
    setFormData(profile); // Reset form data to existing profile
  };

  const handleSave = async () => {
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, formData); // Save changes to Firestore
        setProfile(formData); // Update profile data
        setEditing(false);
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // Update form fields dynamically
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>No profile data found.</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Profile</h1>
      <div className="card">
        <div className="card-body">
          {!editing ? (
            // View Mode
            <>
              <p><strong>Full Name:</strong> {profile.displayName || "N/A"}</p>
              <p><strong>Email:</strong> {profile.email || "N/A"}</p>
              <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
              <p><strong>Address:</strong> {profile.address || "N/A"}</p>
              <p><strong>Company:</strong> {profile.company || "N/A"}</p>
              <p><strong>Role:</strong> {profile.role || "N/A"}</p>
              <button className="btn btn-primary" onClick={handleEdit}>
                Edit Profile
              </button>
            </>
          ) : (
            // Edit Mode
            <>
              <div className="mb-3">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="displayName"
                  value={formData.displayName || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label>Phone</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label>Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label>Company</label>
                <input
                  type="text"
                  className="form-control"
                  name="company"
                  value={formData.company || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="d-flex">
                <button className="btn btn-success me-2" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
