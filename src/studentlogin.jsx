import React from 'react';
import './reg.css';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

function StudentLogin() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/studentlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resText = await response.text();
      console.log(data, resText);

      if (resText.includes('Login successfully')) {
        toast.success('Login successfully');
        navigate('/studentdashboard');
      } else {
        toast.error('Login failed: status is Pending');
      }
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <>
      <ToastContainer />

      <section className="bg-gray-900 h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md dark:border-gray-700">
          <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-white">Sign in to your account</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Your email</label>
                <input type="text" name="email" id="email" className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="CompanyId" {...register('t1', { required: true })} />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Password</label>
                <input type="password" name="password" id="password" className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" {...register('t2', { required: true })} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="remember" type="checkbox" className="w-4 h-4 bg-gray-700 border border-gray-600 rounded focus:ring-blue-500" />
                  </div>
                  <label htmlFor="remember" className="ml-3 text-sm text-gray-300">Remember me</label>
                </div>
                <a href="#" className="text-sm font-medium text-blue-500 hover:underline">Forgot password?</a>
              </div>
              <button type="submit" className="w-full mt-4 p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Sign in</button>
              <p className="mt-4 text-sm text-gray-300">
                Don’t have an account yet? <Link to="/account" className="text-blue-500 hover:underline">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default StudentLogin;
