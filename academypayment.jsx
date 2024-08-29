import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const PayPalForm = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [userInfo, setUserInfo] = useState({ Company_Id: '', client_id: '', client_secret: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch((err) => {
      console.error('Error copying to clipboard:', err);
      toast.error('Failed to copy to clipboard.');
    });
  };

  useEffect(() => {
    fetch('info.json')
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const user = data[0];
          setUserInfo(prev => ({
            ...prev,
            Company_Id: user.Company_Id
          }));
          setValue('academyId', user.Company_Id);
        }
      })
      .catch((error) => console.error('Error fetching user info:', error));
  }, [setValue]);

  useEffect(() => {
    fetch('paypal_Cod.json')
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const credentials = data[0];
          setUserInfo(prev => ({
            ...prev,
            client_id: credentials.client_id,
            client_secret: credentials.client_secret
          }));
          setValue('clientId', credentials.client_id);
          setValue('clientSecret', credentials.client_secret);
        }
      })
      .catch(error => console.error('Error fetching PayPal credentials:', error));
  }, [setValue]);

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <ToastContainer />
      <h2 className="text-center text-3xl font-semibold text-gray-800 mb-8">Enter PayPal Credentials</h2>
      <div className="mb-6">
        <label htmlFor="clientId" className="block text-gray-700 text-sm font-medium mb-2">
          PayPal Client ID
        </label>
        <div className="relative">
          <input
            type="text"
            id="clientId"
            className={`w-full pr-10 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.clientId ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter PayPal Client ID"
            {...register('clientId', { required: 'Client ID is required' })}
            defaultValue={userInfo.client_id}
            disabled={isSubmitted}
            readOnly
          />
          <FontAwesomeIcon
            icon={faCopy}
            className="absolute right-2 top-2 text-gray-500 cursor-pointer"
            onClick={() => copyToClipboard(userInfo.client_id)}
          />
        </div>
        {errors.clientId && <p className="text-red-500 text-xs mt-1">{errors.clientId.message}</p>}
      </div>
      <div className="mb-6">
        <label htmlFor="clientSecret" className="block text-gray-700 text-sm font-medium mb-2">
          PayPal Client Secret
        </label>
        <div className="relative">
          <input
            type="text"
            id="clientSecret"
            className={`w-full pr-10 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.clientSecret ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter PayPal Client Secret"
            {...register('clientSecret', { required: 'Client Secret is required' })}
            defaultValue={userInfo.client_secret}
            disabled={isSubmitted}
            readOnly
          />
          <FontAwesomeIcon
            icon={faCopy}
            className="absolute right-2 top-2 text-gray-500 cursor-pointer"
            onClick={() => copyToClipboard(userInfo.client_secret)}
          />
        </div>
        {errors.clientSecret && <p className="text-red-500 text-xs mt-1">{errors.clientSecret.message}</p>}
      </div>
      <div className="mb-6">
        <input
          type="hidden"
          id="academyId"
          className="w-full px-4 py-2 border rounded-md bg-gray-200"
          defaultValue={userInfo.Company_Id}
          {...register('academyId', { required: 'Academy ID is required' })}
          readOnly
        />
      </div>
    </div>
  );
};

export default PayPalForm;
