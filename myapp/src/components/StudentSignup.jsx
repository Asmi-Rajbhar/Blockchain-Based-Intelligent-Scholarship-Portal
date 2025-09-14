import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const StudentSignup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    aadhaar: ''
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Aadhaar validation function
  const isValidAadhaar = (number) => {
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(number);
  };

  // Update state on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Generate OTP after verifying Aadhaar
  const generateOtp = async () => {
    if (!isValidAadhaar(formData.aadhaar)) {
      setError("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    try {
      const response = await fetch("http://localhost/BlockNSP/studentSignup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      if (data.message === "Valid Aadhaar No") {
        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(newOtp);
        setIsOtpSent(true);
        setError("");
        alert(`Your OTP is: ${newOtp}`);
      } 
      else {
        setError(data.message || "Aadhaar number not found");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to generate OTP. Try again.");
    }
  };

  //Handle OTP verification and registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isValidAadhaar(formData.aadhaar)) {
      setError("Please enter a valid 12-digit Aadhaar number");
      setLoading(false);
      return;
    }

    if (otp !== generatedOtp) {
      setError("Invalid OTP. Please try again.");
      setLoading(false);
      return;
    }

    // Store user data in session and redirect
    sessionStorage.setItem('userData', JSON.stringify(formData));
    setTimeout(() => {
      setLoading(false);
      navigate('/student-details', { state: { fullName: formData.fullName, aadhaar: formData.aadhaar } });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <header style={{ backgroundColor: '#F7768D' }} className="text-white py-4 px-6 rounded-lg mb-6 text-center">
          <h2 className="text-2xl font-bold">Student Register</h2>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-gray-700 text-sm font-medium">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Aadhaar Input */}
          <div className="space-y-2">
            <label htmlFor="aadhaar" className="block text-gray-700 text-sm font-medium">Aadhaar Number</label>
            <input
              type="text"
              id="aadhaar"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={(e) => handleChange({ target: { name: "aadhaar", value: e.target.value.replace(/\D/g, "").slice(0, 12) } })}
              className="w-full px-4 py-2 border-2 border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter 12-digit Aadhaar number"
              required
            />
          </div>

          {/* Generate OTP Button */}
          <button
            type="button"
            onClick={generateOtp}
            className="w-full px-4 py-2 text-white rounded-lg transition-opacity duration-200 shadow-lg" 
            style={{ backgroundColor: '#F7768D' }}
            disabled={loading || !isValidAadhaar(formData.aadhaar)}
          >
            Generate OTP
          </button>

          {/* OTP Input (Visible only after OTP is sent) */}
          {isOtpSent && (
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-gray-700 text-sm font-medium">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2  focus:border-transparent"
                placeholder="Enter 4-digit OTP"
                required
              />
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Register Button */}
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white text-lg font-bold rounded-full hover:opacity-90 transition-opacity duration-200 shadow-lg ${loading || !isOtpSent ? 'cursor-not-allowed opacity-70' : ''}`}
            style={{ backgroundColor: '#F7768D' }}
            disabled={loading || !isOtpSent}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Already have an account? */}
        <div className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/student-login" className="text-pink-500 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
