import { useState } from "react";
import axios from "axios";
import { useNavigate, Navigate, useLocation } from "react-router-dom";


const StudentDetails = () => {
  
   // Code for Generation of Applicant Id
   const generateApplicationId = () => {
    const randomNumbers = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit number
    const randomId = `APP${randomNumbers}`; // Concatenate 'APP' and random number
    return randomId;
  };

  const navigate = useNavigate();

  const newApplicationId = generateApplicationId();
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');

  const [formData, setFormData] = useState({
    applicantId: newApplicationId,
    aadhaar: userData.aadhaar,
    name: "",
    gender: "",
    email: "",
    dob: "",
    mobile: "",
    address: "",
    collegeName: "",
    branch: "",
    currentYear: "",   
    panNumber: "",
    annualIncome: "",
    bankName: "",
    bankAccount: "",    //ifscCode
    accountNumber: "",
  });


  // if (!userData.aadhaar) {
  //   return <Navigate to="/student-signup" replace />;
  // }

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
        setError("");


    // const completeUserData = {
    //   ...userData,
    //   ...formData,
    //   hasCompletedRegistration: true
    // };
    // sessionStorage.setItem('userData', JSON.stringify(completeUserData));
    
    try{
      const response = await axios.post("http://localhost/BlockNSP/applicantRegistration.php", formData);

      const data = response.data;
      alert(data.message);
      console.log("API Response:", data); // Debugging

      // If data inserted in the database the add the data to the ledger as well
      if(data.message == "Data inserted successfully"){
        sessionStorage.setItem("applicantId", formData.applicantId);
        console.log("Sending Data to Backend:", JSON.stringify(formData, null, 2));

        try {
          const registerResponse = await axios.post("http://localhost:3000/register", formData);
  
          if (registerResponse.status === 200) {
            // alert("User Registered Successfully!");
            setShowModal(true); // Show the modal

            // Navigate to dashboard
            // navigate('/student-dashboard');
          } else {
            alert(`Error: ${ledgerRespose.data.error}`);
          }
        } catch (err) {
          console.error(err);
          alert("An error occurred while registering the user.");
        }
      }
    }
    catch(error){
      console.log("Error Inserting Data in the Database: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="bg-blue-800 text-white text-center py-4 rounded-t-lg">
            <h1 className="text-2xl font-semibold">Applicant Application Form</h1>
          </div>
          
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  Name of Applicant <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Bank Account Number or IFSC Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Bank Account Number"
                  required
                />
              </div>
              <div>
            <label className="font-medium text-gray-700" htmlFor="bankName">Bank Name</label>
            <input
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              placeholder="Enter Bank Name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="font-medium text-gray-700" htmlFor="accountNumber">Account Number</label>
            <input
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              placeholder="Enter Account Number"
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
              <div>
            <label className="font-medium text-gray-700">Gender</label>
            <input
              type="text"
              value=  {formData.gender}
              name="gender"
              onChange={handleInputChange}
              placeholder="Enter Gender"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Father/Mother/Guardian/Organization PAN Card Number
                </label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter PAN Card Number"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Mobile Number"
                  required
                />
              </div>
              <div>
            <label className="font-medium text-gray-700" htmlFor="email">Email ID</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Email ID"
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="font-medium text-gray-700" htmlFor="collegeName">College Name</label>
            <input
              id="collegeName"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleInputChange}
              placeholder="Enter College Name"
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="font-medium text-gray-700" htmlFor="branch">Branch</label>
            <input
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              placeholder="Enter Branch"
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="font-medium text-gray-700" htmlFor="currentYear">Current Year of Study</label>
            <input
              id="currentYear"
              name="currentYear"
              value={formData.currentYear} 
              onChange={handleInputChange}
              placeholder="Enter Current Year"
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Annual Income <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Annual Income"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Address"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Upload Annual Income Certificate (PDF) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Digilocker QR Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="text-gray-700">
              Note: Refer to this <a href="#" className="text-blue-500 hover:underline">video</a> on how to access the Digilocker QR code.
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-8 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* ✅ Modal for Showing Applicant ID */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-bold text-center mb-4">Registration Successful!</h3>
            <p className="text-lg text-center mb-4">
              Your Applicant ID: <span className="font-semibold text-blue-500">{formData.applicantId}</span>
            </p>
            <div className="flex justify-center">
              <button onClick={() => navigate("/student-dashboard")} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;