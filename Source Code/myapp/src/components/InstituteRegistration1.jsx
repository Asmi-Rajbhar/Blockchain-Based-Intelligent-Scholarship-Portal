import React, { useState } from 'react';

const RedStar = () => (
  <span className="text-red-500 ml-1">*</span>
);

const FormInput = ({ label, value, onChange, placeholder, type = "text", maxLength, className = "" }) => (
  <div className="space-y-2">
    <label className="block font-cambria text-gray-700 text-sm font-medium">
      {label}
      <RedStar />
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      required
      className={`w-full px-4 py-2 border-2 border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${className}`}
    />
  </div>
);

const InstituteRegistration = ({ onRegistrationComplete }) => {
  const [formData, setFormData] = useState({
    pan: '',
    tan: '',
    mobileNumber: '',
    userEnteredOtp: '',
    otp: '',
  });

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleGetOtp = async () => {
    try {
      const response = await fetch("http://localhost:4000/otp/send-otp", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mobileNumber: formData.mobileNumber })
      });
      const data = await response.json();
      alert(data.message);
      setFormData(prev => ({ ...prev, otp: data.otp }));
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Error sending OTP. Please try again later.");
    }
  };

  const handleVerifyOtp = () => {
    if (formData.userEnteredOtp === formData.otp) {
      alert("OTP verified successfully!");
      if (onRegistrationComplete) {
        onRegistrationComplete();
      }
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header style={{ backgroundColor: '#E94FBB' }} className="text-white py-6 px-8 rounded-lg mb-8">
        <h1 className="text-2xl font-cambria font-bold text-center">
          Institute Registration
        </h1>
      </header>

      <div className="bg-white shadow-xl rounded-xl p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormInput
            label="Enter PAN"
            value={formData.pan}
            onChange={handleChange('pan')}
            placeholder="Enter your PAN"
          />

          <FormInput
            label="Enter TAN"
            value={formData.tan}
            onChange={handleChange('tan')}
            placeholder="Enter your TAN"
          />

          <div className="space-y-2">
            <label className="block font-cambria text-gray-700 text-sm font-medium">
              Enter Mobile Number
              <RedStar />
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.mobileNumber}
                onChange={handleChange('mobileNumber')}
                placeholder="Enter your mobile number"
                className="flex-1 px-4 py-2 border-2 border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                onClick={handleGetOtp}
                style={{ backgroundColor: '#E94FBB' }}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity duration-200"
              >
                Get OTP
              </button>
            </div>
          </div>

          <FormInput
            label="Enter OTP"
            value={formData.userEnteredOtp}
            onChange={handleChange('userEnteredOtp')}
            placeholder="Enter the OTP"
            maxLength="6"
          />
        </div>

        <div className="flex justify-center pt-6">
          <button
            onClick={handleVerifyOtp}
            style={{ backgroundColor: '#E94FBB' }}
            className="px-8 py-3 text-white text-lg font-cambria rounded-full hover:opacity-90 transition-opacity duration-200 shadow-lg"
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstituteRegistration;