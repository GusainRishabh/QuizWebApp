import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Searchbar from './searchbar';

function SelectAcademy() {
  const [userInfo, setUserInfo] = useState([]);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    fetch('academy_data.json')
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          setUserInfo(data);
        } else {
          console.warn('No academy data found.');
        }
      })
      .catch((error) => console.error('Error fetching user info:', error));
  }, []);

  const onSubmit = async (data, academyId) => {
    try {
      const submissionData = { ...data, Company_Id: academyId };
      const response = await fetch("http://localhost:3000/api/chose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });
      const res = await response.text();
      toast.success('Success!');
      navigate('/studentplan');

    } catch (error) {
      console.error("Error:", error);
      toast.error('Error updating profile.');
    }
  };

  return (
    <>
      <div className="bg-gray-900 text-gray-100 min-h-screen">
        <ToastContainer />
        {/* <Searchbar /> */}
        <section className="bg-gray-800">
          <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
              <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">
                Choose Academy
              </h2>
              <p className="font-light text-gray-400 lg:mb-16 sm:text-xl">
                Education empowers individuals with knowledge, skills, and critical thinking, fostering personal growth, innovation, and social change. It equips people to contribute positively to society and navigate life's complexities.
              </p>
            </div>
            <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
              {userInfo.length > 0 ? (
                userInfo.map((academy, index) => (
                  <div key={index} className="items-center bg-gray-700 rounded-lg shadow sm:flex">
                    <a href="#" className="block">
                      <img
                        className="w-full rounded-lg sm:rounded-none sm:rounded-l-lg"
                        src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_dw1xYcaMnsGNDcmejMjkB5DMx3NRXn7vrQ&s`}
                        alt={`Avatar ${index + 1}`}
                      />
                    </a>
                    <form onSubmit={handleSubmit((data) => onSubmit(data, academy.Company_Id))} className="w-full">
                      <div className="p-5">
                        <h3 className="text-xl font-bold tracking-tight text-white">
                          <a href="#" className="block">{academy.Academy_Name}</a>
                        </h3>
                        <span className="text-gray-300">Phone: {academy.Phone_Number}</span>
                        <p className="mt-3 mb-4 font-light text-gray-400">
                          Website: {academy.Company_Website}
                        </p>
                        <p className="mt-3 mb-4 font-light text-gray-400">
                          Email: {academy.Email_Address}
                        </p>
                        <input
                          type="hidden"
                          value={academy.Company_Id}
                          {...register('Company_Id')}
                          readOnly
                        />
                        <button
                          type="submit"
                          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
                          disabled={isSubmitting}
                        >
                          Click Me
                        </button>
                      </div>
                    </form>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">
                  No academies available.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default SelectAcademy;
