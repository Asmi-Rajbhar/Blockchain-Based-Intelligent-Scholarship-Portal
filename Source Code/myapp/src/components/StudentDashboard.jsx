import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import StudentProfileUpdate from './StudentUpdateProfile';

const ScholarshipCard = ({ title, start_date, end_date }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-[#FF7F7F]">{title}</h3>
      </div>
      {/* <p className="text-gray-600 mb-2">{description || "No description available"}</p> */}
      <p className="text-sm text-gray-500">
        <strong>Start Date:</strong> {start_date} | <strong>End Date:</strong> {end_date}
      </p>
      <div className="flex items-center justify-between mt-4">
        <button className="bg-[#F8788E] hover:bg-[#e0677f] text-white px-4 py-2 rounded-lg">
          Register
        </button>
      </div>
    </div>
  );
};

ScholarshipCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  start_date: PropTypes.string.isRequired,
  end_date: PropTypes.string.isRequired,
};

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('scholarships');
  const [scholarships, setScholarships] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'scholarships') {
      fetchScholarships();
    }
  }, [activeTab]);

  const fetchScholarships = async () => {
    try {
      console.log("Fetching scholarships..."); // Debug 1

      const response = await fetch('http://localhost/BlockNSP/allAvailableScholarship.php');

      console.log("Response status:", response.status); // Debug 2

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const text = await response.text();
      console.log("Raw Response:", text); // Debug 3

      try {
        const data = JSON.parse(text);
        console.log("Parsed JSON:", data); // Debug 4

        if (data.message) {
          console.warn("No scholarships found.");
          setScholarships([]);  // Ensure it does not break mapping
          return;
        }

        setScholarships(data);
        console.log("Scholarships set successfully"); // Debug 5

      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } catch (error) {
      console.error('Error fetching scholarships:', error);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    sessionStorage.removeItem("applicationId");
    navigate("/home");
  };

  return (
    <div className="flex min-h-screen bg-[#FF7F7F]/10">
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-8">Student Portal</h2>
          <div className="flex flex-col space-y-4">
            <button onClick={() => setActiveTab('profile')} className={`p-3 rounded-lg text-left ${activeTab === 'profile' ? 'bg-[#F8788E] text-white' : 'text-gray-600 hover:bg-[#f9b3c0]'}`}>Update Profile</button>
            <button onClick={() => setActiveTab('scholarships')} className={`p-3 rounded-lg text-left ${activeTab === 'scholarships' ? 'bg-[#F8788E] text-white' : 'text-gray-600 hover:bg-[#f9b3c0]'}`}>Apply for Scholarships</button>
            <button onClick={() => setActiveTab('my-scholarships')} className={`p-3 rounded-lg text-left ${activeTab === 'my-scholarships' ? 'bg-[#F8788E] text-white' : 'text-gray-600 hover:bg-[#f9b3c0]'}`}>My Scholarships</button>
            <button onClick={handleLogout} className="p-3 rounded-lg text-left text-gray-600 hover:bg-[#f9b3c0]">Log Out</button>
          </div>
        </div>
      </div>
      <div className="flex-1 p-8">
        {activeTab === 'profile' && <StudentProfileUpdate />}
        {activeTab === 'scholarships' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Available Scholarships</h2>
            {scholarships.length > 0 ? (
              <div className="space-y-4">
                {scholarships.map((scholarship, index) => (
                  <ScholarshipCard key={index} {...scholarship} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No scholarships available.</p>
            )}
          </div>
        )}
        {activeTab === 'my-scholarships' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Scholarships</h2>
            <p className="text-gray-600">Your applied scholarships will appear here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
