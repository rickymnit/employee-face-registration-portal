import React from 'react';

const FormInput = ({ label, type = 'text', name, value, onChange, placeholder, error, maxLength }) => {
  return (
    <div className="flex flex-col gap-1 w-full mb-4">
      <label htmlFor={name} className="text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-3 bg-black/40 border rounded-lg outline-none transition-all duration-300 
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_10px_rgba(239,68,68,0.3)]' 
            : 'border-white/10 focus:border-primary focus:shadow-[0_0_15px_rgba(255,77,166,0.3)]'
          } text-white placeholder-gray-500`}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default FormInput;
