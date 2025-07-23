import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Demo initial profile data
const initialProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
};

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [success, setSuccess] = useState(false);

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(form);
    setEditing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  // Cancel editing
  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2">Your Profile</h1>
        <p className="text-gray-500 text-base mb-8 text-center">
          Manage your personal information and account settings here.
        </p>
        <form onSubmit={handleSave} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Name</label>
            {editing ? (
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-gray-50"
                required
              />
            ) : (
              <span className="text-gray-900">{profile.name}</span>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            {editing ? (
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-gray-50"
                required
              />
            ) : (
              <span className="text-gray-900">{profile.email}</span>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Role</label>
            <span className="text-gray-900">{user?.role}</span>
          </div>
          <div className="flex gap-2 mt-4">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Edit
              </button>
            )}
          </div>
          {success && <div className="text-green-600 text-center font-semibold mt-2">Profile updated!</div>}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage; 