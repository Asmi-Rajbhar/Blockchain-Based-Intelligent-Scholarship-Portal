import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import PvtAddScholarship from './PvtAddScholarship'; 
import axios from 'axios';

const PrivateScholarshipCard = ({ title, start_date, end_date }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h3 className="text-xl font-semibold text-[#36AAC7] mb-2">{title}</h3>
      <p className="text-sm text-gray-500">
        <strong>Start Date:</strong> {start_date} | <strong>End Date:</strong> {end_date}
      </p>
    </div>
  );
};

PrivateScholarshipCard.propTypes = {
  title: PropTypes.string.isRequired,
  start_date: PropTypes.string.isRequired,
  end_date: PropTypes.string.isRequired,
};

const PrivateScholarshipDashboard = () => {
  const [activeTab, setActiveTab] = useState('manage-scholarships');
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Retrieve organization registration number from sessionStorage
  const registrationNo = sessionStorage.getItem("registrationNo");

  useEffect(() => {
    if (activeTab === 'manage-scholarships') {
      fetchScholarships();
    }
  }, [activeTab]);

  const fetchScholarships = async () => {
    if (!registrationNo) {
      setError("Registration number not found. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('http://localhost/BlockNSP/organizationScholarship.php', {
        params: { registrationNo }
      });

      console.log("Fetched Scholarships:", response.data);
      
      if (response.data.length === 0 || response.data.message) {
        setError("No scholarships found.");
      } else {
        setScholarships(response.data);
      }
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      setError("Failed to fetch scholarships.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("registrationNo");
    navigate("/home");
  };

  return (
    <div className="flex min-h-screen bg-[#36AAC7]/10">
      <div className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-8">Private Scholarship Portal</h2>
        <div className="flex flex-col space-y-4">
          <button onClick={() => setActiveTab('manage-scholarships')} 
            className={`p-3 rounded-lg text-left ${activeTab === 'manage-scholarships' ? 'bg-[#36AAC7] text-white' : 'text-gray-600 hover:bg-[#36AAC7]/10'}`}>
            Manage Scholarships
          </button>
          <button onClick={() => setActiveTab('add-scholarship')} 
            className={`p-3 rounded-lg text-left ${activeTab === 'add-scholarship' ? 'bg-[#36AAC7] text-white' : 'text-gray-600 hover:bg-[#36AAC7]/10'}`}>
            Add Scholarship
          </button>
          <button onClick={handleLogout} className="p-3 rounded-lg text-left text-gray-600 hover:bg-[#36AAC7]/10">Log Out</button>
        </div>
      </div>

      <div className="flex-1 p-8">
        {activeTab === 'manage-scholarships' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Manage Private Scholarships</h2>
            {loading ? (
              <p className="text-gray-600">Loading scholarships...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="space-y-4">
                {scholarships.map((scholarship, index) => (
                  <PrivateScholarshipCard key={scholarship.sch_id || index} {...scholarship} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'add-scholarship' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Add Scholarship</h2>
            <PvtAddScholarship />
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateScholarshipDashboard;
