import React from 'react'
import logo from '.././assets/nsp-logo.svg'
import {Link} from 'react-router-dom'
import '.././css/navbar.css'
import Mainslider from './Mainslider.jsx'

const Navbar = () => {
  return (
    <div className="mainnavbar">
        <div className="leftnav">
          <Link to="/home">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="rightnav">
            <ul>
                <Link to="/home" className="faq-link">FAQ</Link>
                <Link to="/home" className="faq-link">Announcements</Link>
                <Link to="/home" className="faq-link">Helpdesk</Link>  
            </ul>            
        </div>
    </div>
  );
}

export default Navbar;
