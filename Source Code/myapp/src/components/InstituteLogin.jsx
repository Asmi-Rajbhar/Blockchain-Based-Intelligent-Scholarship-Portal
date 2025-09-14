import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import PropTypes from 'prop-types';
import axios from 'axios'; // Import axios
import "../css/instlogin.css";

const RedStar = () => (
  <span className="text-red-500 ml-1">*</span>
);

const FormInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  className = ""
}) => (
  <div className="space-y-2">
    <label className="block font-medium text-gray-700 text-sm">
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

const InstituteRegistration = ({ onRegistrationComplete = undefined }) => {
  const [formData, setFormData] = useState({
    registrationNo: '',
    mobileNumber: '',
    userEnteredOtp: '',
  });
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ Initialize the navigate function

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setError(""); // Clear error when user types
  };

  const handleGetOtp = async () => {
    if (!formData.mobileNumber) {
      setError("Please enter a mobile number");
      return;
    }

    setLoading(true);

    if (formData.registrationNo) {
      sessionStorage.setItem('registrationNo', formData.registrationNo);

      try {
        const response = await axios.post("http://localhost/BlockNSP/instituteLogin.php", {
          registrationNo: formData.registrationNo,
        });

        if (response.data && response.data.message === "Institute Registered") {
          console.log("Verified Successfully");

          // ✅ Generate a 4-digit OTP
          const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
          setGeneratedOtp(newOtp);
          setIsOtpSent(true);
          setError("");
          setLoading(false);
          alert(`Your OTP is: ${newOtp}`);
        } else {
          alert("Invalid Registration No");
        }
      } catch (error) {
        console.error("Error verifying Registration No", error);
        alert("Error occurred while verifying Registration No");
      }
    } else {
      alert("Please enter a valid Registration No");
    }
  };

  const handleVerifyOtp = () => {
    if (!formData.userEnteredOtp) {
      setError("Please enter the OTP");
      return;
    }

    if (formData.userEnteredOtp === generatedOtp) {
      setError("");
      alert("OTP verified successfully!");

      // ✅ Store Application ID in sessionStorage
      sessionStorage.setItem("registrationNo", registrationNo);

      // ✅ Navigate to institute dashboard after successful OTP verification
      navigate("/institute-dashboard");  

      if (onRegistrationComplete) {
        onRegistrationComplete();
      }
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header style={{ backgroundColor: '#E94FBB' }} className="text-white py-6 px-8 rounded-lg mb-8">
        <h1 className="text-2xl font-bold text-center">
          Institute Login
        </h1>
      </header>

      <div className="bg-white shadow-xl rounded-xl p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormInput
            label="Enter Registration Id"
            value={formData.registrationNo}
            onChange={handleChange('registrationNo')}
            placeholder="Enter your Registration No"
          />

          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-medium">
              Enter Mobile Number
              <RedStar />
            </label>
            <div className="flex space-x-2">
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={handleChange('mobileNumber')}
                placeholder="Enter your mobile number"
                className="flex-1 px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                onClick={handleGetOtp}
                disabled={loading || !formData.mobileNumber}
                style={{ backgroundColor: '#E94FBB' }}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Get OTP'}
              </button>
            </div>
          </div>

          {isOtpSent && (
            <FormInput
              label="Enter OTP"
              value={formData.userEnteredOtp}
              onChange={handleChange('userEnteredOtp')}
              placeholder="Enter the 4-digit OTP"
              type="number"
              maxLength={4}
            />
          )}
        </div>

        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}

        <div className="flex justify-center pt-6">
          <button
            onClick={handleVerifyOtp}
            disabled={!isOtpSent || !formData.userEnteredOtp || loading}
            style={{ backgroundColor: '#E94FBB' }}
            className="px-8 py-3 text-white text-lg rounded-full hover:opacity-90 transition-opacity duration-200 shadow-lg disabled:opacity-50"
          >
            Verify OTP
          </button>

          <Link to="/institute-register2" className="px-8 py-3 text-white text-lg rounded-full" id="register-button">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

InstituteRegistration.propTypes = {
  onRegistrationComplete: PropTypes.func
};

export default InstituteRegistration;
