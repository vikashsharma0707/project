

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Css/Profile.css"

function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Student',
    profileImage: null, // Keep basic profile image upload
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get('https://project-1-2eem.onrender.com/api/users/profile/' + JSON.parse(atob(token.split('.')[1])).id, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          role: res.data.role,
          profileImage: res.data.profileImage || null,
        });
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load profile');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImage: file });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'profileImage' && formData.profileImage instanceof File) {
        data.append(key, formData.profileImage);
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const res = await axios.put(`https://project-1-2eem.onrender.com/api/users/${JSON.parse(atob(token.split('.')[1])).id}`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setUser(res.data);
      alert('Profile updated successfully');
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`https://project-1-2eem.onrender.com/api/users/${JSON.parse(atob(token.split('.')[1])).id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem('token');
        navigate('/login');
        alert('Profile deleted successfully');
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete profile');
      }
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Update Profile</h1>
          <button className="close-btn" onClick={() => navigate('/dashboard')}>×</button>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="profile-content">
          <div className="profile-form">
            <form onSubmit={handleUpdate} className="auth-form">
              <div className="profile-image-section">
                <label htmlFor="profileImage" className="profile-image-label">
                  {formData.profileImage ? (
                    <img src={formData.profileImage instanceof File ? URL.createObjectURL(formData.profileImage) : formData.profileImage} alt="Profile" className="profile-image" />
                  ) : (
                    <div className="profile-image-placeholder">
                      <span>Upload Image</span>
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="profile-image-input"
                  style={{ display: 'none' }}
                />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
              />
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Institute">Institute</option>
              </select>
              <div className="profile-buttons">
                <button type="button" className="cancel-btn" onClick={() => navigate('/dashboard')}>CANCEL</button>
                <button type="submit" className="save-btn">SAVE</button>
                <button type="button" className="delete-btn" onClick={handleDelete}>DELETE</button> {/* Added delete button */}
              </div>
            </form>
          </div>
          <div className="profile-preview">
            <img src={formData.profileImage instanceof File ? URL.createObjectURL(formData.profileImage) : (formData.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`)} alt="Preview" className="preview-image" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;