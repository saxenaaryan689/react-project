import React, { useState, useRef } from 'react';

function ImageUpload({ onImageChange, preview }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleClick = () => fileInputRef.current.click();

  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onImageChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div
      className={`image-upload-zone ${isDragging ? 'dragging' : ''} ${preview ? 'has-preview' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={!preview ? handleClick : undefined}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />

      {preview ? (
        <div className="upload-preview">
          <img src={preview} alt="Preview" className="upload-preview-img" />
          <div className="upload-preview-overlay">
            <button className="btn-change-photo" onClick={handleClick}>Change Photo</button>
            <button className="btn-remove-photo" onClick={handleRemove}>Remove</button>
          </div>
        </div>
      ) : (
        <div className="upload-placeholder">
          <div className="upload-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="upload-main-text">Drag & Drop photo here</p>
          <p className="upload-sub-text">or <span className="upload-browse-link">click to browse</span></p>
          <p className="upload-hint">PNG, JPG, WEBP supported</p>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
