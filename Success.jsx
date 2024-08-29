import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Success = () => {
  const location = useLocation();
  const { details } = location.state;

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e2e2e2, #ffffff)',
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
    color: '#4caf50',
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
    backgroundColor: '#4caf50',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#45a049',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Payment Successful</h1>
        <p style={paragraphStyle}><strong>Transaction ID:</strong> {details.id}</p>
        <p style={paragraphStyle}><strong>Payer Name:</strong> {details.payer.name.given_name} {details.payer.name.surname}</p>
        <p style={paragraphStyle}><strong>Payer Email:</strong> {details.payer.email_address}</p>
        <p style={paragraphStyle}><strong>Amount:</strong> {details.purchase_units[0].amount.value} {details.purchase_units[0].amount.currency_code}</p>
        <a href="/" style={{ ...buttonStyle, ...buttonHoverStyle }}>Go to Home</a>
      </div>
    </div>
  );
};

export default Success;
