import React from 'react';

const Footer = () => {
  const styles = {
    footer: {
      backgroundColor: 'rgb(237, 237, 237)',
      padding: '10px 20px',
      textAlign: 'center',
      fontWeight: 'bold',
      position: 'fixed', // Fixes the footer at the bottom of the viewport
      bottom: 0, // Aligns it to the bottom
      width: '100%', // Makes sure it spans the full width
    },
    spacer: {
      height: '60px', // Same height as the footer to prevent content overlap
    },
  };

  return (
    <>
      {/* Spacer to prevent overlap */}
      <div style={styles.spacer}></div>
      <footer style={styles.footer}>
        Developed By Vesit Students
      </footer>
    </>
  );
};

export default Footer;
