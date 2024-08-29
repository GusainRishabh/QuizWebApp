import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentPage = () => {
  const [plan, setPlan] = useState({ Plan: '' });

  useEffect(() => {
    axios.get('/plan.json')
      .then(response => {
        setPlan(response.data[0]);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
        alert("Failed to load plan data");
      });

    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      console.log('Razorpay script loaded');
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      const response = await fetch('http://localhost:3000/create-orderrazer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseFloat(plan.Plan) }), 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { orderId } = await response.json();

      const options = {
        key: 'rzp_test_Cq0xxou13fQFcl', // Use the environment variable with REACT_APP_ prefix
        amount: parseFloat(plan.Plan) * 100, // Convert to paise
        currency: 'INR',
        name: 'Your Company Name',
        description: 'Test Transaction',
        order_id: orderId,
        handler: function (response) {
          console.log('Payment response:', response);

          fetch('http://localhost:3000/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })
          .then(res => res.json())
          .then(data => {
            if (data.msg === 'Captured') {
              alert('Payment successful!');
            } else {
              alert('Payment verification failed!');
            }
          })
          .catch(error => {
            console.error('Error verifying payment:', error);
            alert('An error occurred while verifying the payment.');
          });
        },
        prefill: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#F37254',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error during payment:', error);
      alert('An error occurred while processing the payment.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Complete Your Payment</h1>
        <p className="text-gray-300 text-center mb-8">
          You are about to make a payment of ₹{plan.Plan}. Please click the button below to proceed.
        </p>
        <button onClick={handlePayment} className="text-white bg-gradient-to-br from-purple-600 w-full to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
