import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PrivateOrgSignup = () => {
  const [formData, setFormData] = useState({
    tan: '',
    mobileNumber: ''
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [registrationId, setRegistrationId] = useState("");  // Store Registration ID to display
  const [showModal, setShowModal] = useState(false);  // State to control modal visibility

  // TAN validation function
  const isValidTan = (tan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(tan);

  // Mobile number validation
  const isValidMobile = (number) => /^[6-9]\d{9}$/.test(number);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Generate OTP after verifying TAN and Mobile Number
  const generateOtp = async () => {
    if (!isValidTan(formData.tan)) {
      setError("Invalid TAN number. Format: ABCD12345X");
      return;
    }

    if (!isValidMobile(formData.mobileNumber)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    try {
      const response = await fetch("http://localhost/BlockNSP/organizationSignup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      if (data.message === "Registered Organization") {
        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(newOtp);
        setIsOtpSent(true);
        setError("");
        alert(`Your OTP is: ${newOtp}`);
      } else {
        setError(data.message || "Organization not found.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to generate OTP. Try again.");
    }
  };

  // Handle OTP verification and Registration ID generation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validations before generating registration number
    if (!isValidTan(formData.tan)) {
      setError("Invalid TAN number. Format: ABCD12345X");
      setLoading(false);
      return;
    }

    if (!isValidMobile(formData.mobileNumber)) {
      setError("Enter a valid 10-digit mobile number.");
      setLoading(false);
      return;
    }

    if (otp !== generatedOtp) {
      setError("Invalid OTP. Please try again.");
      setLoading(false);
      return;
    }

    // Generate Registration ID (SO_PR_XXXXX) after OTP verification
    const registrationNo = `SO_PR_${Math.floor(10000 + Math.random() * 90000)}`;
    setRegistrationId(registrationNo);  // Store Registration ID

    // Store Application ID in sessionStorage
    sessionStorage.setItem("registrationNo", registrationNo);

    setTimeout(() => {
      setLoading(false);
      setShowModal(true);  // Show modal after generating the registration ID
    }, 1500);  // Simulate loading before showing the modal
  };

  // Close the modal and navigate to the next page
  const handleCloseModal = () => {
    setShowModal(false);  // Close the modal
    navigate('/pvtorg-dashboard');  // Navigate to the next page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <header style={{ backgroundColor: '#F7768D' }} className="text-white py-4 px-6 rounded-lg mb-6 text-center">
          <h2 className="text-2xl font-bold">Private Organization Registration</h2>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* TAN Number Input */}
          <div className="space-y-2">
            <label htmlFor="tan" className="block text-gray-700 text-sm font-medium">TAN Number</label>
            <input
              type="text"
              id="tan"
              name="tan"
              value={formData.tan}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter TAN (Format: ABCD12345X)"
              required
            />
          </div>

          {/* Mobile Number Input */}
          <div className="space-y-2">
            <label htmlFor="mobileNumber" className="block text-gray-700 text-sm font-medium">Mobile Number</label>
            <input
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={(e) => handleChange({ target: { name: "mobileNumber", value: e.target.value.replace(/\D/g, "").slice(0, 10) } })}
              className="w-full px-4 py-2 border-2 border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter 10-digit mobile number"
              required
            />
          </div>

          {/* Generate OTP Button */}
          <button
            type="button"
            onClick={generateOtp}
            className="w-full px-4 py-2 text-white rounded-lg transition-opacity duration-200 shadow-lg"
            style={{ backgroundColor: '#F7768D' }}
            disabled={loading || !isValidTan(formData.tan) || !isValidMobile(formData.mobileNumber)}
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
                className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
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

        {/* Already Registered? */}
        <div className="mt-4 text-center text-gray-600">
          Already registered? <Link to="/pvt-login" className="text-pink-500 hover:underline">Login</Link>
        </div>

        {/* Modal to display Registration ID */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-2xl font-bold text-center mb-4">Registration Successful!</h3>
              <p className="text-lg text-center mb-4">Your Registration ID: <span className="font-semibold text-blue-500">{registrationId}</span></p>
              <div className="flex justify-center">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateOrgSignup;
