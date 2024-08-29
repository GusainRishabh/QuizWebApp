import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PayPalPayment = () => {
  const [orderID, setOrderID] = useState(null);
  const [clientId, setClientId] = useState('');

  useEffect(() => {
    // Fetch client ID from backend
    const fetchClientId = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/paypal-client-id');
        if (response.data && response.data.client_id) {
          setClientId(response.data.client_id);
        } else {
          throw new Error('Client ID not found');
        }
      } catch (error) {
        console.error('Error fetching PayPal client ID:', error);
        toast.error('Error fetching PayPal client ID');
      }
    };

    fetchClientId();
  }, []);

  const createOrder = async (data, actions) => {
    try {
      const response = await axios.post('http://localhost:3000/api/create-order');
      setOrderID(response.data.id);
      return response.data.id;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      toast.error('Error creating order');
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const response = await axios.post('http://localhost:3000/api/capture-order', { orderID: data.orderID });
      toast.success('Payment successful');
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      toast.error('Error capturing payment');
    }
  };

  return (
    <div>
      <ToastContainer />
      {clientId ? (
        <PayPalScriptProvider options={{ "client-id": clientId }}>
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
          />
        </PayPalScriptProvider>
      ) : (
        <p>Loading PayPal...</p>
      )}
    </div>
  );
};

export default PayPalPayment;
