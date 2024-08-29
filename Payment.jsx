// Payment.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Payment = () => {
  const [approvalUrl, setApprovalUrl] = useState('');

  useEffect(() => {
    const createPayment = async () => {
      try {
        const response = await axios.get('/Success');
        setApprovalUrl(response.data.approval_url);
      } catch (error) {
        console.error('Error creating payment:', error);
      }
    };

    createPayment();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Processing Payment...</h1>
      {approvalUrl ? (
        <a href={approvalUrl} style={styles.link}>Complete Payment</a>
      ) : (
        <p style={styles.message}>Please wait while we redirect you to PayPal...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#fff3e0'
  },
  header: {
    fontSize: '2em',
    color: '#ff9800'
  },
  message: {
    fontSize: '1.2em',
    margin: '20px 0'
  },
  link: {
    textDecoration: 'none',
    color: '#2196f3',
    fontSize: '1em'
  }
};

export default Payment;
