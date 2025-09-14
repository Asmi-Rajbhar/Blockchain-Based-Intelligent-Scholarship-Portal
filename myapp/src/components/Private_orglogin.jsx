import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios"; 
import { Link, useNavigate } from "react-router-dom"; 

const RedStar = () => <span className="text-red-500 ml-1">*</span>;

const FormInput = ({ label, value, onChange, placeholder, type = "text", maxLength, className = "" }) => (
  <div className="space-y-2">
    <label className="block text-gray-700 text-sm font-medium">
      {label}
      <RedStar />
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={type === "text" ? maxLength : undefined}
      inputMode={type === "number" ? "numeric" : undefined}
      required
      className={`w-full px-4 py-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    />
  </div>
);

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string,
  maxLength: PropTypes.number,
  className: PropTypes.string
};

const InstituteLogin = ({ onRegistrationComplete = undefined }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    registrationNumber: "",
    mobileNumber: "",
    userEnteredOtp: "",
  });
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleGetOtp = async () => {
    if (!formData.mobileNumber) {
      setError("Please enter a mobile number");
      return;
    }

    setLoading(true); 

    try {
      const response = await axios.post("http://localhost/BlockNSP/organizationLogin.php", formData);

      if (response.data && response.data.message === "Organization Registered") {
        console.log("Organization Verified Successfully");
        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(newOtp);
        setIsOtpSent(true);
        setError("");
        alert(`Your OTP is: ${newOtp}`);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Invalid Registration Number:", error);
      setError("An error occurred while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    if (formData.userEnteredOtp === generatedOtp) {
      setError("");
      alert("OTP verified successfully!");

      // Store registration number in session storage
      sessionStorage.setItem("registrationNo", formData.registrationNumber);

      navigate("/pvtorg-dashboard");
      if (onRegistrationComplete) {
        onRegistrationComplete();
      }
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="bg-blue-500 text-white py-6 px-8 rounded-lg mb-8">
        <h1 className="text-2xl font-bold text-center">Private Organization Login</h1>
      </header>

      <div className="bg-white shadow-xl rounded-xl p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormInput
            label="Enter Registration Number"
            value={formData.registrationNumber}
            onChange={handleChange("registrationNumber")}
            placeholder="Enter your Registration number"
          />

          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-medium">
              Mobile Number
              <RedStar />
            </label>
            <div className="flex space-x-2">
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={handleChange("mobileNumber")}
                placeholder="Enter your mobile number"
                className="flex-1 px-4 py-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleGetOtp}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 border-2 border-blue-500 bg-blue-500 disabled:opacity-50"
                disabled={!formData.mobileNumber || loading} 
              >
                {loading ? "Sending..." : "Get OTP"} 
              </button>
            </div>
          </div>

          {isOtpSent && (
            <FormInput
              label="Enter OTP"
              value={formData.userEnteredOtp}
              onChange={handleChange("userEnteredOtp")}
              placeholder="Enter the 4-digit OTP"
              type="number"
              maxLength={4}
            />
          )}
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="flex justify-center pt-6">
          <button
            onClick={handleVerifyOtp}
            className="px-8 py-3 text-white text-lg rounded-full hover:opacity-90 transition-opacity duration-200 shadow-lg border-2 border-blue-500 bg-blue-500 disabled:opacity-50"
            disabled={!isOtpSent || !formData.userEnteredOtp}
          >
            Verify OTP
          </button>
        </div>
        <div className="mt-4 text-center text-gray-600">
          <Link to="/pvt-signup" className="text-pink-500 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

InstituteLogin.propTypes = {
  onRegistrationComplete: PropTypes.func,
};

export default InstituteLogin;
