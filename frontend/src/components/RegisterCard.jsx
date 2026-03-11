import React, { useState } from 'react';
import FormInput from './FormInput';
import ImageUpload from './ImageUpload';

const RegisterCard = () => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    mobile: '',
    image: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageSelect = (file, error) => {
    if (error) {
      setErrors((prev) => ({ ...prev, image: error }));
      setPreviewUrl(null);
      setFormData((prev) => ({ ...prev, image: null }));
    } else if (file) {
      setErrors((prev) => ({ ...prev, image: null }));
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required (Enter 0 if none)';
    
    // Validate 10 digit mobile
    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile Number is required';
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.image) newErrors.image = 'Selfie is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess(false);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('employee_id', formData.employeeId);
      submitData.append('mobile', formData.mobile);
      submitData.append('image', formData.image);

      // In production, this hits the relative FastAPI route (if served together)
      // or configured via an environment variable. We'll use the absolute URL for Railway/local backend interoperability
      // assuming the frontend app gets the API URL from Vite env, fallback to relative
      //const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const apiUrl = https://web-production-9f2a3.up.railway.app/
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        // Try parsing JSON error from FastAPI
        let errorMsg = 'Upload failed. Please try again.';
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch(e) {}
        
        throw new Error(errorMsg);
      }

      setSuccess(true);
      // Reset form on success
      setFormData({ name: '', employeeId: '', mobile: '', image: null });
      setPreviewUrl(null);
    } catch (err) {
      setApiError('Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md p-8 rounded-2xl glassmorphism pink-glow-border flex flex-col items-center justify-center min-h-[400px] text-center transform transition-all duration-500 scale-100 animate-in fade-in zoom-in-95">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 shadow-pink-glow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Registration Successful 🎉</h2>
        <p className="text-gray-300 mb-8">Your face has been registered.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-300 font-medium font-sans"
        >
          Register Another
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 rounded-2xl glassmorphism pink-glow-border transition-all duration-300 relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Register Your Face</h2>
          <p className="text-sm text-gray-400">Upload a clear selfie and your employee details</p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center font-medium animate-pulse">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <FormInput 
            label="Full Name" 
            name="name" 
            placeholder="John Doe" 
            value={formData.name} 
            onChange={handleInputChange} 
            error={errors.name}
          />
          <FormInput 
            label="Employee ID (0 if none)" 
            name="employeeId" 
            placeholder="EMP12345 or 0" 
            value={formData.employeeId} 
            onChange={handleInputChange} 
            error={errors.employeeId}
          />
          <FormInput 
            label="Mobile Number" 
            name="mobile" 
            type="tel" 
            maxLength={10}
            placeholder="1234567890" 
            value={formData.mobile} 
            onChange={handleInputChange} 
            error={errors.mobile}
          />

          <ImageUpload 
            onImageSelect={handleImageSelect} 
            previewUrl={previewUrl} 
            error={errors.image}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 flex items-center justify-center
              ${isSubmitting 
                ? 'bg-primary/50 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary/90 shadow-pink-glow hover:shadow-pink-glow-lg'
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              'Register Face'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterCard;
