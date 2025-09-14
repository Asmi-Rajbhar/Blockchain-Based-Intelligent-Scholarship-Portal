import React from 'react'
import tlogo from '.././assets/Digital-India-Color.svg'
import '.././css/navbar.css'

const Topnav = () => {
  return (
    <>
      <div className="topnav">
        <div className="lefttopnav">
          <p>Government of India | </p>
          <p>Ministry of Electronics & Information Technology | </p>
          <img src={tlogo} alt="digital india" />
        </div>
        <div className="righttopnav">
          <p>English</p>
        </div>
      </div>
    </>
  )
}

export default Topnav;
