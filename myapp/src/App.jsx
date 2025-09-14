import { useState } from 'react'
import './index.css'
import './App.css'
import {Route,Routes,Navigate, BrowserRouter} from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import Topnav from './components/Topnav.jsx'
import Footer from './components/footer.jsx'
import StudentLogin from './components/StudentLogin.jsx'
import StudentSignup from './components/StudentSignup.jsx'
import StudentDashboard from './components/StudentDashboard.jsx'
import InstituteLogin from './components/InstituteLogin.jsx'
import InstituteSignup from './components/InstituteSignup.jsx'
import InstituteDashboard from './components/InstituteDashboard.jsx'
import StudentDetails from './components/StudentDetails.jsx'
import InstituteRegistration1 from './components/InstituteRegistration1.jsx'
import InstituteRegistration2 from './components/InstituteRegistration2.jsx'
import PrivateScholarshipDashboard from './components/PvtScholarshipDashboard.jsx'
import Private_orglogin from './components/Private_orglogin.jsx'
import InstitutionUpdateForm from './components/InstitutionUpdateForm.jsx'
import StudentProfileUpdate from './components/StudentUpdateProfile.jsx'
import PvtAddScholarship from './components/PvtAddScholarship.jsx'
import PrivateOrgSignup from './components/PrivateOrgSignUp.jsx'



function App() {

  return (
    <>
    <Topnav />
    <Navbar />
      <Routes>
          <Route path="/" element={<Navigate to ="/home" />} />
          <Route path="/home" element={<Home />} />
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/home" element={<Home />} /> */}
          {/* <Route path="/faq" element={<Faq />} />
          <Route path="/announcements" elements={<Announce />} />
          <Route path="/helpdesk" elements={<Helpdesk />} /> */}
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/student-signup" element={<StudentSignup />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-details" element={<StudentDetails />} />
          <Route path="/institute-login" element={<InstituteLogin />} />
          <Route path="/institute-signup" element={<InstituteSignup />} />  
          <Route path="/institute-dashboard" element={<InstituteDashboard />} />
          <Route path="/institute-register1" element={<InstituteRegistration1 />} />
          <Route path="/institute-register2" element={<InstituteRegistration2 />} />
          <Route path="/pvtorg-dashboard" element={<PrivateScholarshipDashboard />} />
          <Route path="/pvt-login" element={<Private_orglogin />} />
          <Route path="/inst-update-profile" element={<InstitutionUpdateForm />} />
          <Route path="/student-update-profile" element={<StudentProfileUpdate />} />
          <Route path="/inst-update-form" element={<InstitutionUpdateForm />} />
          <Route path="/pvt-add-scholarship" element={<PvtAddScholarship/>} />
          <Route path="/pvt-signup" element={<PrivateOrgSignup/>} /> 

        </Routes>
    <Footer />
    </>
  )
}

export default App
