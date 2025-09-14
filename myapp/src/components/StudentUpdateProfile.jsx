import React, { useState, useEffect } from "react"; 
import axios from "axios";

const StudentProfileUpdate = ({ onSubmit = () => {} }) => {  //Default function to prevent errors
  const [applicationId, setApplicationId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  

  const [formData, setFormData] = useState({
    applicationId: "",
    candidateName: "",
    aadharNumber: "",
    gender: "",
    dateOfBirth: "",
    mobileNo: "",
    email: "",
    address: "",
    collegeName: "",
    branch: "",
    currentYear: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  //Fetch Application ID from SessionStorage
  useEffect(() => {
    const storedAppId = sessionStorage.getItem("applicationId");
    if (storedAppId) {
      setApplicationId(storedAppId);
    } else {
      setError("Application ID not found. Please log in again.");
      setLoading(false);
    }
  }, []);

  //Fetch Data After Setting Application ID
  useEffect(() => {
    if (applicationId) {
      fetchStudentData(applicationId);
    }
  }, [applicationId]);

  // 🔹 Fetch Student Profile Data
  const fetchStudentData = async (appId) => {
    try {
      const response = await axios.get("http://localhost/BlockNSP/applicantRegistration.php", {
        params: { applicationId: appId }, 
      });

      console.log("API Response:", response.data); 

      if (response.data.status === "success") {
        const fetchedData = response.data.data;

        setFormData({
          applicationId: appId,  //Ensure Application ID is updated
          candidateName: fetchedData.Applicant_name || "",
          aadharNumber: fetchedData.Aadhar_no || "",
          gender: fetchedData.Gender || "",
          dateOfBirth: fetchedData.Date_of_birth || "",
          mobileNo: fetchedData.Mobile_no || "",
          email: fetchedData.EmailId || "",
          address: fetchedData.Address || "",
          collegeName: fetchedData.College_Name || "",
          branch: fetchedData.Branch || "",
          currentYear: fetchedData.Current_Year || "",
          bankName: fetchedData.Bank_Name || "",
          accountNumber: fetchedData.Account_Number || "",
          ifscCode: fetchedData.ifsc || "",
        });
      } else {
        setError(response.data.message || "Failed to load profile data.");
      }
    } catch (error) {
      console.error("Error fetching applicant data:", error);
      setError("Error fetching profile data.");
    } finally {
      setLoading(false);
    }
  };

  //Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);

    try {
      const response = await axios.put("http://localhost/BlockNSP/applicantRegistration.php", formData);
      alert(response.data.message);
      console.log("API Response:", response.data); // ✅ Debugging
    } catch (error) {
      console.log("Error updating data in the database:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg border">
      <h2 className="text-center text-xl font-semibold text-white bg-[#F8788E] p-4 rounded-t-lg mb-6">
        Student Profile Update
      </h2>

      {/* Show Error Message */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 🔹 Non-updatable fields */}
          <div>
            <label className="font-medium text-gray-700">Application ID</label>
            <input value={applicationId} disabled className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"/>
          </div>

          <div>
            <label className="font-medium text-gray-700">Candidate Name</label>
            <input value={formData.candidateName} disabled className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"/>
          </div>

          <div>
            <label className="font-medium text-gray-700">Aadhar Number</label>
            <input value={formData.aadharNumber} disabled className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"/>
          </div>

          <div>
            <label className="font-medium text-gray-700">Gender</label>
            <input value={formData.gender} disabled className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"/>
          </div>

          <div>
            <label className="font-medium text-gray-700">Date of Birth</label>
            <input value={formData.dateOfBirth} disabled className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"/>
          </div>

          {/* 🔹 Updatable fields */}
          <div>
            <label className="font-medium text-gray-700" htmlFor="mobileNo">Mobile Number</label>
            <input id="mobileNo" name="mobileNo" value={formData.mobileNo} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg"/>
          </div>

          <div>
            <label className="font-medium text-gray-700" htmlFor="email">Email ID</label>
            <input id="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg"/>
          </div>

          <div>
            <label className="font-medium text-gray-700" htmlFor="address">Address</label>
            <input id="address" name="address" value={formData.address} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg"/>
          </div>

           {/* 🔹 College Details Section */}
           <div className="col-span-2 border-t pt-4">
            <h3 className="text-[#F8788E] font-semibold text-lg mb-4">College Details</h3>
          </div>

          <div>
            <label className="font-medium text-gray-700" htmlFor="collegeName">College Name</label>
            <input id="collegeName" name="collegeName" value={formData.collegeName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg"/>
          </div>

          <div>
            <label className="font-medium text-gray-700" htmlFor="branch">Branch</label>
            <input id="branch" name="branch" value={formData.branch} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg"/>
          </div>

          <div>
            <label className="font-medium text-gray-700" htmlFor="currentYear">Current Year</label>
            <input id="currentYear" name="currentYear" value={formData.currentYear} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg"/>
          </div>

          {/* 🔹 Bank Details Section */}
          <div className="col-span-2 border-t pt-4">
            <h3 className="text-[#F8788E] font-semibold text-lg mb-4">Bank Details</h3>
          </div>

          <div>
            <label className="font-medium text-gray-700" htmlFor="bankName">Bank Name</label>
            <input id="bankName" name="bankName" value={formData.bankName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg"/>
          </div>

          <div>
            <label className="font-medium text-gray-700" htmlFor="accountNumber">Account Number</label>
            <input id="accountNumber" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg"/>
          </div>

          <div>
            <label className="font-medium text-gray-700" htmlFor="ifscCode">IFSC Code</label>
            <input id="ifscCode" name="ifscCode" value={formData.ifscCode} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg"/>
          </div>

        </div>

        <div className="flex justify-center mt-6">
          <button type="submit" className="bg-[#F8788E] hover:bg-pink-600 text-white px-8 py-2 rounded-lg shadow-md">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentProfileUpdate;
