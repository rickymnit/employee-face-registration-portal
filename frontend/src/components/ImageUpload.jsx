import React, { useState, useRef } from 'react';

const ImageUpload = ({ onImageSelect, previewUrl, error }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const validateAndHandleFile = (file) => {
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      onImageSelect(null, 'Please upload a JPG or PNG image.');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onImageSelect(null, 'Image size must be less than 5MB.');
      return;
    }

    onImageSelect(file, null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndHandleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndHandleFile(e.target.files[0]);
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-1 w-full mb-6">
      <label className="text-sm font-medium text-gray-300">Upload Selfie</label>
      
      <div 
        className={`relative w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden
          ${isDragActive ? 'border-primary bg-primary/10 shadow-pink-glow' : 'border-white/20 bg-black/40 hover:border-primary/50 hover:bg-white/5'}
          ${error && !isDragActive ? 'border-red-500 bg-red-500/10' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerSelect}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/jpeg, image/png, image/jpg"
          onChange={handleChange}
        />

        {previewUrl ? (
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-300 backdrop-blur-sm">
              <span className="text-white font-medium">Click to change photo</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            <p className="text-sm text-gray-300 font-medium">Drag and drop your selfie</p>
            <p className="text-xs text-gray-500 mt-1">or click to browse (JPG, PNG)</p>
          </div>
        )}
      </div>
      
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default ImageUpload;
