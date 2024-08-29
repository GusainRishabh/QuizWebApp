import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const OTPVerification = ({ setShowOTP }) => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmitOTP = async (event) => {
    event.preventDefault();
    const data = { otp };

    try {
      const response = await fetch('http://localhost:3000/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const resText = await response.text();
      console.log(data, resText);
      if (resText === 'success') {
        toast.success('OTP verification successful!');
        navigate('/purchaseplanacademy');
      } else if (resText === 'otp_expired') {
        toast.error('OTP has expired. Please request a new one.');
      } else if (resText === 'invalid_otp') {
        toast.error('Invalid OTP. Please try again.');
      } else {
        toast.error('OTP verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md border border-gray-300">
      <ToastContainer />
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Enter your OTP</h2>
        <p className="text-sm text-gray-600">We've sent a one-time code to your Email. Enter it below to verify.</p>
      </div>
      <form onSubmit={handleSubmitOTP}>
        <div className="mb-4">
          <input
            type="text"
            maxLength={6}
            className="w-full h-12 text-center text-lg border border-gray-300 rounded outline-none"
            value={otp}
            onChange={handleInputChange}
          />
        </div>
        <div className="mt-4">
          <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded cursor-pointer hover:bg-blue-600 focus:outline-none">
            Verify OTP
          </button>
        </div>
      </form>
    </div>
  );
};

export default OTPVerification;
