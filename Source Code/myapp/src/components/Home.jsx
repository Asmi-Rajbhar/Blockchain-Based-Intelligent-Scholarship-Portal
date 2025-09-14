import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import Mainslider from './Mainslider.jsx';
import '.././css/home.css';
import InstitutionUpdateForm from './InstitutionUpdateForm.jsx';

const Home = (props) => {
  return (
    <>
      <Mainslider />
      <div className="hhome1">
        <div className="hcard1">
          <Link to="/student-login" className="hcardLink">
            <div className="card-content">
              Students
            </div>
          </Link>
        </div>
        <div className="hcard2">
          <Link to="/institute-login" className="hcardLink">
            <div className="card-content">
              Institutions
            </div>
          </Link>
        </div>
        <div className="hcard3">
          <Link to="/pvt-login" className="hcardLink">
            <div className="card-content">
              Private Organisation
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
