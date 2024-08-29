import React from 'react';
import { useLocation } from 'react-router-dom';

const Failure = () => {
  const location = useLocation();
  const { details } = location.state || { message: "An error occurred" };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8d7da, #f5c6cb)',
    padding: '20px',
    textAlign: 'center',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    padding: '30px',
    maxWidth: '600px',
    width: '100%',
    margin: '20px',
    position: 'relative',
  };

  const headingStyle = {
    color: '#dc3545',
    fontSize: '2.5rem',
    marginBottom: '20px',
    fontWeight: 'bold',
  };

  const paragraphStyle = {
    margin: '15px 0',
    fontSize: '1.1rem',
    color: '#555',
  };

  const buttonStyle = {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#dc3545',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    textDecoration: 'none',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Payment Failed</h1>
        <p style={paragraphStyle}><strong>Error Message:</strong> {details.message}</p>
        <p style={paragraphStyle}><strong>Transaction ID:</strong> {details.id || "N/A"}</p>
        <p style={paragraphStyle}><strong>Reason:</strong> {details.reason || "Unknown error occurred"}</p>
        <a href="/" style={buttonStyle}>Return to Home</a>
      </div>
    </div>
  );
};

export default Failure;
