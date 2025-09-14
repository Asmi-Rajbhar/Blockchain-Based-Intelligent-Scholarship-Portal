import React, { useState, useEffect } from "react";
import axios from "axios";

const OrganizationForm = () => {
  const [registrationNo, setRegistrationNo] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // For showing/hiding the modal
  const [loading, setLoading] = useState(false);
  const options = ["Undergraduate", "Medical", "Law Student", "CA", "Post Graduation"];
  const religions = ["Christianity", "Islam", "Hinduism", "Buddhism", "Judaism", "Sikhism", "Atheism", "Other"];
  const castes = ["General", "OBC", "SC", "ST", "Other"];

  const [formData, setFormData] = useState({
    registrationNo: "",
    registration12AA: "",
    organizationName: "",
    scholarshipAmount: "",
    academicYear: "",
    scholarshipName: "",
    incomeCriteria: "",
    ageLimit: "",
    fieldOfStudy: [],
    hscScore: "",
    sscScore: "",
    religion: "",
    caste: "",
    startsOn: "",
    endsOn: "",
    officialUrl: "",
    guidelines: null,
    schemeId: "",
  });

  // Fetch Registration Number from sessionStorage
  useEffect(() => {
    const storedRegNo = sessionStorage.getItem("registrationNo");
    if (storedRegNo) {
      setRegistrationNo(storedRegNo); // Set the registration number if it exists in sessionStorage
      setFormData((prevData) => ({ ...prevData, registrationNo: storedRegNo })); // Set it in formData
    } else {
      setError("Registration No not found. Please log in again.");
      setLoading(false);
    }
  }, []);

  // Function to handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  // Function to handle multiple field selection for Field of Study
  const handleFieldChange = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      fieldOfStudy: prevData.fieldOfStudy.includes(field)
        ? prevData.fieldOfStudy.filter((f) => f !== field)
        : [...prevData.fieldOfStudy, field],
    }));
  };

  // Function to handle religion and caste selection
  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to generate a unique Scheme ID (with only 5 characters after "SCHEME_")
  const generateSchemeId = () => {
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // Generates a number between 10000 and 99999
    return `SCHEME_${randomNumber}`;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Generate the Scheme ID
    const schemeId = generateSchemeId();
    setFormData((prevData) => ({ ...prevData, schemeId }));

    setTimeout(() => {
      setLoading(false);
      setShowModal(true); // Show the modal after the form is submitted
    }, 1500); // Simulate delay before showing the modal (optional)
  };

  // Function to close modal and submit data to the backend
  const handleModalClose = async () => {
    setShowModal(false); // Close the modal

    try {
      // Send the form data to the backend
      const response = await axios.post("http://localhost/BlockNSP/scholarshipRegistration.php", formData);
      const data = response.data;

      if (data.message === "Scholarship Registered Successfully") {
        alert("Scholarship Added"); // Show success message
        
      } else {
        // alert("Failed to register the Scholarship");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while registering the scholarship.");
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="shadow-lg bg-white rounded-lg">
          <div className="bg-[#36AAC7] text-white rounded-t-lg py-4">
            <h2 className="text-2xl font-bold text-center">New Scheme Registration</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Organization Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Organization Information</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label htmlFor="registration12AA">12AA Registered Number</label>
                    <input
                      id="registration12AA"
                      name="registration12AA"
                      value={formData.registration12AA}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="organizationName">Scholarship Organization Name</label>
                    <input
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="scholarshipAmount">Scholarship Amount</label>
                    <input
                      id="scholarshipAmount"
                      name="scholarshipAmount"
                      type="number"
                      value={formData.scholarshipAmount}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="academicYear">Academic Year</label>
                    <input
                      id="academicYear"
                      name="academicYear"
                      type="date"
                      value={formData.academicYear}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Scholarship Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Scholarship Information</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label htmlFor="scholarshipName">Scholarship Name</label>
                    <input
                      id="scholarshipName"
                      name="scholarshipName"
                      value={formData.scholarshipName}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Eligibility Criteria</h3>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label htmlFor="incomeCriteria">Annual Income (Less Than)</label>
                    <input
                      id="incomeCriteria"
                      name="incomeCriteria"
                      value={formData.incomeCriteria}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="ageLimit">Age Limit</label>
                    <input
                      id="ageLimit"
                      name="ageLimit"
                      value={formData.ageLimit}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="space-y-4">
                    <label>Field of Study</label>
                    <div className="grid grid-cols-2 gap-4">
                      {options.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={option}
                            checked={formData.fieldOfStudy.includes(option)}
                            onChange={() => handleFieldChange(option)}
                            className="cursor-pointer"
                          />
                          <label htmlFor={option} className="text-sm font-normal">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="hscScore">HSC Score</label>
                      <input
                        id="hscScore"
                        name="hscScore"
                        value={formData.hscScore}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="sscScore">SSC Score</label>
                      <input
                        id="sscScore"
                        name="sscScore"
                        value={formData.sscScore}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label>Religion</label>
                      <select
                        value={formData.religion}
                        onChange={(e) => handleSelectChange("religion", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="">Select Religion</option>
                        {religions.map((religion) => (
                          <option key={religion} value={religion}>
                            {religion}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label>Caste</label>
                      <select
                        value={formData.caste}
                        onChange={(e) => handleSelectChange("caste", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="">Select Caste</option>
                        {castes.map((caste) => (
                          <option key={caste} value={caste}>
                            {caste}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="startsOn">Starts On</label>
                      <input
                        id="startsOn"
                        name="startsOn"
                        type="date"
                        value={formData.startsOn}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="endsOn">Ends On</label>
                      <input
                        id="endsOn"
                        name="endsOn"
                        type="date"
                        value={formData.endsOn}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="officialUrl">Official URL</label>
                    <input
                      id="officialUrl"
                      name="officialUrl"
                      type="url"
                      value={formData.officialUrl}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="guidelines">Guidelines</label>
                    <br />
                    <input
                      id="guidelines"
                      name="guidelines"
                      type="file"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#36AAC7] text-white py-2 rounded hover:bg-[#36AAC7]/85"
              >
                Submit Registration
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal for showing Scheme ID */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-bold text-center mb-4">Registration Successful!</h3>
            <p className="text-lg text-center mb-4">
              Your Scheme ID: <span className="font-semibold text-blue-500">{formData.schemeId}</span>
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleModalClose}
                className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationForm;
