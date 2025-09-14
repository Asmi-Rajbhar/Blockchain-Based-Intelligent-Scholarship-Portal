import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RedStar = () => <span style={{ color: "red" }}>*</span>;

const StudentLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [userEnteredOTP, setUserEnteredOTP] = useState(""); // Single input field for OTP
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState(""); // Stores the generated OTP
  const navigate = useNavigate();

  const handleAppIdChange = (e) => {
    setApplicationId(e.target.value);
  };

  const handleOtpChange = (e) => {
    setUserEnteredOTP(e.target.value);
  };

  const handleGetOtp = async () => {
    if (!applicationId) {
      setError("Please enter a valid Application ID.");
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost/BlockNSP/studentLogin.php", { applicationId });

      if (response.data && response.data.message === "Applicant Registered") {
        console.log("Applicant ID Verified Successfully");

        //Generate a 4-digit OTP
        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(newOtp);
        setOtpSent(true);
        setError("");
        setLoading(false);
        alert(`Your OTP is: ${newOtp}`);
      } else {
        alert("Invalid Application ID.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error verifying application ID:", error);
      alert("Error occurred while verifying application ID.");
      setLoading(false);
    }
  };

  const handleVerify = () => {
    if (!userEnteredOTP) {
      setError("Please enter the OTP");
      return;
    }

    if (userEnteredOTP === generatedOtp) {
      alert("OTP verified successfully!");
      
      // Store Application ID in sessionStorage
      sessionStorage.setItem("applicationId", applicationId);

      // Navigate to student dashboard
      navigate("/student-update-profile");
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-start justify-center bg-gray-100 px-4 pt-10">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <header style={{ backgroundColor: "#E94FBB" }} className="text-white py-4 px-6 rounded-lg mb-6 text-center">
          <h2 className="text-2xl font-cambria font-bold">Student Login</h2>
        </header>

        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="applicationId" className="block font-cambria text-gray-700 text-sm font-medium">
              Application ID <RedStar />
            </label>
            <div className="flex">
              <input
                type="text"
                id="applicationId"
                className="w-2/3 px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Enter your application ID"
                value={applicationId}
                onChange={handleAppIdChange}
                required
              />
              <button
                type="button"
                className="w-1/3 ml-2 bg-pink-500 text-white px-4 py-2 rounded-lg"
                onClick={handleGetOtp}
                disabled={loading}
              >
                {loading ? "Sending..." : "Get OTP"}
              </button>
            </div>
          </div>

          {otpSent && (
            <div className="space-y-2 mt-4">
              <label htmlFor="otp" className="block font-cambria text-gray-700 text-sm font-medium">
                Enter OTP <RedStar />
              </label>
              <input
                type="text"
                id="otp"
                className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-center"
                maxLength="4"
                value={userEnteredOTP}
                onChange={handleOtpChange}
                placeholder="Enter the 4-digit OTP"
                required
              />
            </div>
          )}

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <div className="mt-4 text-center">
            <button
              type="button"
              style={{ backgroundColor: "#E94FBB" }}
              className={`w-full px-4 py-2 text-white text-lg font-cambria rounded-full hover:opacity-90 transition-opacity duration-200 shadow-lg ${
                loading ? "cursor-not-allowed opacity-70" : ""
              }`}
              onClick={handleVerify}
              disabled={!otpSent || loading}
            >
              Verify OTP
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-gray-600">
          <Link to="/student-signup" className="text-pink-500 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
