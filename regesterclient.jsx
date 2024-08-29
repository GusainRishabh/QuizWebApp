import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const PayPalForm = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [userInfo, setUserInfo] = useState({ Company_Id: '', client_id: '', client_secret: '' });
  const [isSubmitted, setIsSubmitted] = useState(false); // New state for form submission status
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/api/paypal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (response.ok) {
        toast.success('Credentials saved successfully!');
        setIsSubmitted(true); // Set to true once submission is successful
        // navigate('/Loginform'); // Uncomment this if you want to navigate on success
      } else {
        toast.error(res.message || 'Error saving credentials.');
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error('Error saving credentials.');
    }
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
          setValue('academyId', user.Company_Id); // Sets the value of academyId directly
        }
      })
      .catch((error) => console.error('Error fetching user info:', error));
  }, [setValue]);

  return (
    <div className="max-w-md mx-auto">
      <ToastContainer />
      <h2 className="text-center text-2xl font-bold mb-6">Enter PayPal Credentials</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            id="clientId"
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${errors.clientId ? 'border-red-600' : 'border-gray-300'} appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
            placeholder=" "
            {...register('clientId', { required: 'Client ID is required' })}
            defaultValue={userInfo.client_id} // Display the client_id
            disabled={isSubmitted} // Disable if form has been submitted
          />
          <label
            htmlFor="clientId"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            PayPal Client ID
          </label>
          {errors.clientId && <p className="text-red-600 text-xs mt-1">{errors.clientId.message}</p>}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            id="clientSecret"
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${errors.clientSecret ? 'border-red-600' : 'border-gray-300'} appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
            placeholder=" "
            {...register('clientSecret', { required: 'Client Secret is required' })}
            defaultValue={userInfo.client_secret} // Display the client_secret
            disabled={isSubmitted} // Disable if form has been submitted
          />
          <label
            htmlFor="clientSecret"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            PayPal Client Secret
          </label>
          {errors.clientSecret && <p className="text-red-600 text-xs mt-1">{errors.clientSecret.message}</p>}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="hidden"
            id="academyId"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            defaultValue={userInfo.Company_Id}
            {...register('academyId', { required: 'Academy ID is required' })}
            readOnly
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          disabled={isSubmitted} // Disable submit button if form has been submitted
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PayPalForm;
