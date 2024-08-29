import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';

const PayPalButton = ({ amount }) => {
  const clientId = 'AYsD4EzuPuEYIfd1jEmJgMFwVfkhomjNl4d_ste-ZNKMAOTEgDCU2_7BHxz_UYldpTq0x8NdK5L6bkRD';
  const navigate = useNavigate();
  const [transactionState, setTransactionState] = useState({ success: false, error: false, message: '' });

  const handleTransaction = async (orderId, amount, payerEmail, status) => {
    try {
      const response = await fetch('http://localhost:3000/api/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, amount, payerEmail, status }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from server:', errorText);
        setTransactionState({ success: false, error: true, message: `Failed to save transaction data: ${errorText}` });
        throw new Error('Failed to save transaction data');
      }

      console.log('Transaction data saved successfully');
      setTransactionState({ success: true, error: false, message: 'Transaction data saved successfully' });
    } catch (err) {
      console.error('Error saving transaction data:', err);
      setTransactionState({ success: false, error: true, message: `Error saving transaction data: ${err.message}` });
      navigate('/Failed', { state: { error: err.message } });
    }
  };

  return (
    <PayPalScriptProvider options={{ "client-id": clientId }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: amount } }],
          }).then(orderId => {
            console.log('Order created:', orderId);
            return orderId;
          }).catch(err => {
            console.error('Error creating order:', err);
            setTransactionState({ success: false, error: true, message: 'Failed to create PayPal order' });
            navigate('/Failed', { state: { error: 'Failed to create PayPal order' } });
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(details => {
            console.log('Order captured:', details);
            const { id: orderId } = details;
            const payerEmail = details.payer.email_address;
            return handleTransaction(orderId, amount, payerEmail, 'success').then(() => {
              if (!transactionState.error) {
                navigate('/Success', { state: { details } });
              }
            });
          }).catch(err => {
            console.error('Error capturing order or handling transaction:', err);
            setTransactionState({ success: false, error: true, message: err.message });
            handleTransaction(data.orderID, amount, data.payer.email_address, 'failure');
            navigate('/Failed', { state: { error: err.message } });
          });
        }}
        onError={(err) => {
          console.error('PayPal Buttons onError:', err);
          setTransactionState({ success: false, error: true, message: err.message || 'An error occurred with the PayPal transaction.' });
          handleTransaction(data.orderID, amount, data.payer.email_address, 'failure');
          navigate('/Failed', { state: { error: err.message || 'An error occurred with the PayPal transaction.' } });
        }}
      />
      {transactionState.success && <p style={{ color: 'green' }}>{transactionState.message}</p>}
      {transactionState.error && <p style={{ color: 'red' }}>{transactionState.message}</p>}
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
