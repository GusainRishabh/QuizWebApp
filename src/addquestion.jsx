import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import './masterpage.css';
import { Link } from 'react-router-dom';

function AddQuestion() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    fetch('info.json')
      .then((response) => response.json())
      .then((data) => {
        setUserInfo(data[0]);
        setValue('Company_Id', data[0].Company_Id);
      })
      .catch((error) => console.error('Error fetching user info:', error));
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Question added successfully!');
        // Optionally, navigate or reset form here
      } else {
        toast.error('Question add failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while submitting the form');
    }
  };

  return (
    <>
      <div>
        <nav>
          <div className="logo">
            <img
              src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/education-logo-best-teacher-logo-design-template-7e9b38bf124afd7bbeae2c4aaa59480a_screen.jpg?ts=1677768434"
              alt="Logo"
            />
            <a href="#" target="_blank" rel="noopener noreferrer">Rishabh</a>
          </div>
          <ul>
            <li><a href="#main">Home</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#about">About Me</a></li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#feedback">Feedback</a></li>
          </ul>
          <ul>
            <li><Link to="/studentlogin">Student Login</Link></li>
            <li><Link to="/Loginform">Company Login</Link></li>
            <li><Link to="/Dashboard">Dashboard Login</Link></li>
            <li><Link to="/addquestion">Add Question</Link></li>
          </ul>
        </nav>

        <div style={{ marginTop: '20px' }}>
          <ToastContainer />
          <form className="max-w-sm mx-auto" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="PaperCode" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              <h1>Select Paper Code</h1>
            </label>
            <select id="PaperCode" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('Paper_Code', { required: true })}>
              <option value="">Select Paper Code</option>
              <option value="Paper A">Paper A</option>
              <option value="Paper B">Paper B</option>
              <option value="Paper C">Paper C</option>
              <option value="Paper D">Paper D</option>
            </select>
            {errors.Paper_Code && <span>This field is required</span>}

            <label htmlFor="SerialNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Serial Number
            </label>
            <input type="text" id="SerialNumber" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Serial Number" {...register('Serial_Number', { required: true })} />
            {errors.Serial_Number && <span>This field is required</span>}

            <label htmlFor="Section" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              <h1>Select Section</h1>
            </label>
            <select id="Section" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('Section', { required: true })}>
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
            {errors.Section && <span>This field is required</span>}

            <label htmlFor="AddQuestion" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{ marginTop: '20px' }}>
              Add Question
            </label>
            <input type="text" id="AddQuestion" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Add Questions" {...register('Add_Question', { required: true })} />
            {errors.Add_Question && <span>This field is required</span>}

            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label htmlFor="Option1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Option 1
                </label>
                <input type="text" id="Option1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Option 1" {...register('Option_1', { required: true })} />
                {errors.Option_1 && <span>This field is required</span>}
              </div>
              <div>
                <label htmlFor="Option2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Option 2
                </label>
                <input type="text" id="Option2" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Option 2" {...register('Option_2', { required: true })} />
                {errors.Option_2 && <span>This field is required</span>}
              </div>
              <div>
                <label htmlFor="Option3" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Option 3
                </label>
                <input type="text" id="Option3" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Option 3" {...register('Option_3', { required: true })} />
                {errors.Option_3 && <span>This field is required</span>}
              </div>
              <div>
                <label htmlFor="Option4" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Option 4
                </label>
                <input type="text" id="Option4" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Option 4" {...register('Option_4', { required: true })} />
                {errors.Option_4 && <span>This field is required</span>}
              </div>
            </div>

            <label htmlFor="RightAnswer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Answer
            </label>
            <input type="text" id="RightAnswer" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Answer" {...register('Right_Answer', { required: true })} />
            {errors.Right_Answer && <span>This field is required</span>}

            <input type="hidden" {...register('Company_Id')} value={userInfo.Company_Id || ''} />

            <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600" disabled={isSubmitting}>
              Add Question
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddQuestion;
