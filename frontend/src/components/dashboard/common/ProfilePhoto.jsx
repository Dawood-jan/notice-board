import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';

const ProfilePhoto = ({ onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useContext(AuthContext);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        setIsLoading(true);
        console.log('Uploading file...');

        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}users/profile-photo`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        console.log(response.data);

        if (response.data.success) {
          console.log(response.data.photoUrl);
          onUpload(response.data.photoUrl);
        } else {
          console.error('Upload failed:', response.data.message);
        }
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setIsLoading(false);
        onClose();
      }
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="profilePhoto">Upload Profile Photo</label>
            <input type="file" id="profilePhoto" onChange={handleFileChange} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePhoto;
