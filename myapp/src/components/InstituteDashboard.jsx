import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'
import InstitutionUpdateForm from './InstitutionUpdateForm';

const ScholarshipCard = ({ 
  title, 
  description, 
}) => {

  ScholarshipCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-[#E94FBB]">{title}</h3>
      </div>
      
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="flex items-center justify-between">
          <button 
            className="bg-[#D16EB5] hover:bg-[#B95DA0] text-white px-4 py-2 rounded-lg"
          >
            Register
          </button>
        </div>
      </div>
  );
};

const InstituteDashboard = () => {
  const [activeTab, setActiveTab] = useState('scholarships');
  const history = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    // Remove session storage data
    sessionStorage.removeItem("registrationNo"); 

    // Redirect to home
    history("/home");
};


  // Sample scholarship data
  const scholarships = [
    {
      id: 1,
      title: "National Scholarship Portal Scheme 2024",
      description: "National Scholarships Portal is one-stop solution through which various services starting from student application, application receipt, processing, sanction and disbursal of various scholarships to students are enabled.",
    },
    {
      id: 2,
      title: "Merit-based Scholarship Program",
      description: "Scholarship program for outstanding academic achievers with demonstrated excellence in their field of study.",
    },
    {
      id: 3,
      title: "Research Fellowship Grant",
      description: "Special grants for students pursuing research in emerging technologies and innovation.",
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#E94FBB]/10">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-8">Student Portal</h2>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`p-3 rounded-lg text-left ${
                activeTab === 'profile'
                  ? 'bg-[#D16EB5] text-white'
                  : 'text-gray-600 hover:bg-[#F3C1E4]'
              }`}
            >
              Update Profile
            </button>
            {/* <button
              onClick={() => setActiveTab('scholarships')}
              className={`p-3 rounded-lg text-left ${
                activeTab === 'scholarships'
                  ? 'bg-[#D16EB5] text-white'
                  : 'text-gray-600 hover:bg-[#F3C1E4]'
              }`}
            >
              Apply for Scholarships
            </button> */}
            {/* <button
              onClick={() => setActiveTab('my-scholarships')}
              className={`p-3 rounded-lg text-left ${
                activeTab === 'my-scholarships'
                  ? 'bg-[#D16EB5] text-white'
                  : 'text-gray-600 hover:bg-[#F3C1E4]'
              }`}
            >
              My Scholarships
            </button> */}
            <button
              onClick={handleLogout}
              className={`p-3 rounded-lg text-left ${
                activeTab === 'logout'
                  ? 'bg-[#D16EB5] text-white'
                  : 'text-gray-600 hover:bg-[#F3C1E4]'
              }`}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
            <div className="text-gray-600"><InstitutionUpdateForm /></div>
            </div>
        )}

        {/* {activeTab === 'scholarships' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Available Scholarships</h2>
            <div className="space-y-4">
              {scholarships.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  {...scholarship}
                />
              ))}
            </div>
          </div>
        )} */}

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

export default InstituteDashboard;