import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentRegistration = () => {
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch CompanyDetails
        const companyResponse = await fetch('CompanyDetails.json');
        const companyData = await companyResponse.json();
        if (companyData.academy.length > 0) {
          const company = companyData.academy[0];
          setValue('Company_Id', company.Company_Id); // Set Company_Id in the form
        }

        // Fetch student plan
        const planResponse = await fetch('studentplan.json');
        const planData = await planResponse.json();
        if (planData.length > 0) {
          const plan = planData[0];
          setValue('t9', plan.plan); // Set plan in the form
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching data. Please try again.');
      }
    };

    fetchData();
  }, [setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('t1', data.t1);
    formData.append('t2', data.t2);
    formData.append('t3', data.t3);
    formData.append('t4', data.t4);
    formData.append('t5', data.t5);
    formData.append('t6', data.t6);
    formData.append('t7', data.t7);
    formData.append('t8', data.t8);
    formData.append('t9', data.t9);
    formData.append('t10', data.t10);
    formData.append('t11', data.t11[0]); // File
    formData.append('Company_Id', data.Company_Id); // Company_Id

    try {
      const response = await fetch('http://localhost:3000/studentregration', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Registration Successful!');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className='bg-gray-900 text-white min-h-screen p-6'>
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium">Student Name</label>
            <input type="text" id="first_name" className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Your Name" {...register('t1')} />
          </div>
          <div>
            <label htmlFor="file_input" className="block mb-2 text-sm font-medium">Upload File</label>
            <input id="file_input" type="file" className="block w-full text-sm text-white border border-gray-700 rounded-lg cursor-pointer bg-gray-800" {...register('t11')} />
          </div>
          <div>
            <label htmlFor="last_name" className="block mb-2 text-sm font-medium">Last Name</label>
            <input type="text" id="last_name" className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Last Name" {...register('t2')} />
          </div>
          <div>
            <label htmlFor="Address" className="block mb-2 text-sm font-medium">Address</label>
            <input type="text" id="Address" className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Address" {...register('t3')} />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium">Phone Number</label>
            <input type="tel" id="phone" className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="123-45-678" {...register('t4')} />
          </div>
          <div>
            <label htmlFor="father_name" className="block mb-2 text-sm font-medium">Father Name</label>
            <input type="text" id="father_name" className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Father Name" {...register('t5')} />
          </div>
          <div>
            <label htmlFor="student_id" className="block mb-2 text-sm font-medium">Student ID</label>
            <input type="text" id="student_id" className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Student ID" {...register('t6')} />
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">Email Address</label>
          <input type="email" id="email" className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="example@domain.com" {...register('t7')} />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
          <input type="password" id="password" className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" {...register('t8')} />
        </div>
        <div className="mb-6">
          <label htmlFor="plan" className="block mb-2 text-sm font-medium">Plan</label>
          <input type="text" id="plan" className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" {...register('t9')} />
        </div>
        <div className="mb-6">
          <select hidden>
            <option value="Pending" {...register('t10')}>Pending</option>
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="company_id" className="block mb-2 text-sm font-medium">Company ID</label>
          <input type="text" id="company_id" className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" readOnly {...register('Company_Id')} />
        </div>
        <button type="submit" disabled={isSubmitting} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5">Register</button>
      </form>
    </div>
  );
};

export default StudentRegistration;
