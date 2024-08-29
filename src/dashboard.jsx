import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify'; // Ensure toast is imported
import 'react-toastify/dist/ReactToastify.css';
import Hambuger from './hambuger';
import uploadnotes from './uploadnotes.jsx';
import UpdatePaymentAmount from './updateamount.jsx';

function Dashboard() {
  const [userInfo, setUserInfo] = useState({ Company_Id: '' });

  const navigate = useNavigate();
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
      const response = await fetch("http://localhost:3000/Pending_request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        navigate('/regesterdstudents');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error processing request');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error submitting request');
    }
  };

  const onSubmit1 = async (data) => {
    console.log('Submitting data:', data); // Log the data being submitted
    try {
      const response = await fetch("http://localhost:3000/displayquestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      
      if (response.ok) {
        console.log(result.message); // Optional: Log success message
        navigate('/deletedata'); // Navigate to the new page
      } else {
        console.error('Error response:', result); // Log the error response
        alert(result.message || 'Error processing request'); // Show error message
      }
    } catch (error) {
      console.error('Error submitting request:', error); // Log the error
      alert('Error submitting request'); // Show general error message
    }
  };
  
  
  const onSubmitDelete = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/deletequestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        navigate('/dashboard');
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Error processing request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Error submitting request');
    }
  };
  const onSubmitpay = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/Academy_Payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        navigate('/academypayment');
      } else {
        const error = await response.json();
        navigate('/Regesterclient');

        toast.error(error.message || 'Error processing request');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error submitting request');
    }
  };
  const academy = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/fetchacademy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        navigate('/dashboard');
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Error processing request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Error submitting request');
    }
  };
  return (
    <div>
      <ToastContainer />
      <nav>
        <div className="logo">
          <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/education-logo-best-teacher-logo-design-template-7e9b38bf124afd7bbeae2c4aaa59480a_screen.jpg?ts=1677768434" alt="Logo" />
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
          <li><Hambuger/></li>  
        </ul>
      </nav>
      <center>
        <div style={{ height: '600px', marginTop: '20px', width: '70%', display: 'flex' }}>
          <div style={{ height: '600px', width: '100%', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            <div style={{ height: '33%', width: '33%' }}>
              <Link to="/addquestion">
                <div className="w-full max-w-md h-51 bg-blue-500 rounded-lg p-6 text-white flex items-center justify-between shadow-lg">
                  <div>
                    <h3 className="text-xl font-bold">POST QUESTIONS</h3>
                    <p className="text-sm">MCQ</p>
                    <div className="relative w-12 h-12 mt-4">
                      <div className="absolute top-0 left-0 w-full h-full rounded-full" style={{ backgroundColor: 'conic-gradient' }}>
                        <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold" style={{ color: 'black' }}>75%</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-5xl">📚</div>
                </div>
              </Link>
            </div>
            <div style={{ height: '33%', width: '33%' }}>

              <form onSubmit={handleSubmit(onSubmit1)}>

                <div className="w-full max-w-md h-51 bg-red-500 rounded-lg p-6 text-white flex items-center justify-between shadow-lg">
                  <div>
                  <h3><input type="text" {...register('Company_Id')} defaultValue={userInfo.Company_Id || ''} value='Delete Question Paper' style={{cursor:'pointer'}} hidden/></h3>
                  <h1><input type="submit" style={{ cursor: 'pointer' }} value='Click Me'/></h1>
                    <p className="text-sm">Delete</p>
                    <div className="relative w-12 h-12 mt-4">
                      <div className="absolute top-0 left-0 w-full h-full rounded-full" style={{ backgroundColor: 'conic-gradient' }}>
                        <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold">75%</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-5xl">🖊️</div>
                </div>

                </form>

                </div>
                <div style={{ height: '33%', width: '33%' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full max-w-md h-51 bg-purple-500 rounded-lg p-6 text-white flex items-center justify-between shadow-lg">
                <div>
                <input type="text" {...register('Company_Id')} defaultValue={userInfo.Company_Id || ''} value='Delete Question Paper' style={{cursor:'pointer'}} hidden/>
                  <input type="submit" className="text-xl font-bold" value={"Pending Request"}/>
                  <p className="text-sm">Pending_request</p>
                  <div className="relative w-12 h-12 mt-4">
                    <div className="absolute top-0 left-0 w-full h-full rounded-full" style={{ backgroundColor: 'conic-gradient' }}>
                      <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold">75%</div>
                    </div>
                  </div>
                 
                </div>
                <div className="text-5xl">👨🏻‍🎓</div>
              </div>
              </form>

            </div>
            <div style={{ height: '33%', width: '33%' }}>
              <form onSubmit={handleSubmit(onSubmitDelete)}>
                <div className="w-full max-w-md h-51 bg-yellow-500 rounded-lg p-6 text-white flex items-center justify-between shadow-lg">
                  <div>
                    <h3><input type="text" {...register('Company_Id')} defaultValue={userInfo.Company_Id || ''} value='Delete Question Paper' style={{ cursor: 'pointer' }} hidden/></h3>
                    <h1><input type="submit" style={{ cursor: 'pointer' }} value='Click Me'/></h1>
                    <h3 className="text-xl font-bold">Delete All Paper</h3>
                    <div className="relative w-12 h-12 mt-4">
                      <div className="absolute top-0 left-0 w-full h-full rounded-full" style={{ backgroundColor: 'conic-gradient' }}>
                        <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold">75%</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-5xl">📝</div>
                </div>
              </form>
            </div>
            <div style={{ height: '33%', width: '33%' }}>
            <Link to="/studentregration">
              <div className="w-full max-w-md h-51 bg-orange-500 rounded-lg p-6 text-white flex items-center justify-between shadow-lg">
                <div>
                  <h3 className="text-xl font-bold">Regester Students</h3>
                  <p className="text-sm">35 Lessons</p>
                  <div className="relative w-12 h-12 mt-4">
                    <div className="absolute top-0 left-0 w-full h-full rounded-full" style={{ backgroundColor: 'conic-gradient' }}>
                      <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold">75%</div>
                    </div>
                  </div>
                </div>
                <div className="text-5xl">👤</div>
              </div>
              </Link>
            </div>
            <div style={{ height: '33%', width: '33%' }}>
            <form onSubmit={handleSubmit(onSubmitpay)}>
            <div className="w-full max-w-md h-51 bg-purple-500 rounded-lg p-6 text-white flex items-center justify-between shadow-lg">
                <div>
                <h3><input type="text" {...register('Company_Id')} defaultValue={userInfo.Company_Id || ''} value='Delete Question Paper' style={{ cursor: 'pointer' }} hidden/></h3>
                <h1><input type="submit" style={{ cursor: 'pointer' }} value='Click Me'/></h1>
                <p className="text-sm">payment received Page</p>
                  <div className="relative w-12 h-12 mt-4">
                    <div className="absolute top-0 left-0 w-full h-full rounded-full" style={{ backgroundColor: 'conic-gradient' }}>
                      <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold">75%</div>
                    </div>
                  </div>
                 
                </div>
                <div className="text-5xl">💴</div>
              </div>
              </form>

            </div>
            <div style={{ height: '33%', width: '33%' }}>
            <Link to="/EducationalVideos">
              <div className="w-full max-w-md h-51 bg-gray-500 rounded-lg p-6 text-white flex items-center justify-between shadow-lg">
                <div>
                  <h3 className="text-xl font-bold">Education Materal</h3>
                  <p className="text-sm">35 Lessons</p>
                  <div className="relative w-12 h-12 mt-4">
                    <div className="absolute top-0 left-0 w-full h-full rounded-full" style={{ backgroundColor: 'conic-gradient' }}>
                      <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold">75%</div>
                    </div>
                  </div>
                </div>
                <div className="text-5xl">🧑🏻‍🏫</div>
              </div>
              </Link>
            </div>
            <div style={{ height: '33%', width: '33%' }}>
            <form onSubmit={handleSubmit(academy)}>
              <div className="w-full max-w-md h-51 bg-pink-500 rounded-lg p-6 text-white flex items-center justify-between shadow-lg">
                <div>
                  <button type='submit' className="text-xl font-bold">Clikc Me</button>

                  <p className="text-sm">35 Lessons</p>
                  <div className="relative w-12 h-12 mt-4">
                    <div className="absolute top-0 left-0 w-full h-full rounded-full" style={{ backgroundColor: 'conic-gradient' }}>
                      <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold">75%</div>
                    </div>
                  </div>
                </div>
                <div className="text-5xl">⌚</div>
              </div>
              </form>
            </div>
            <div style={{ height: '33%', width: '33%' }}>
            <Link to="/uploadnotes">

              <div className="w-full max-w-md h-51 bg-blue-500 rounded-lg p-6 text-white flex items-center justify-between shadow-lg">
                <div>
                <h3 className="text-xl font-bold">Upload Notes</h3>
                <p className="text-sm">35 Lessons</p>
                  <div className="relative w-12 h-12 mt-4">
                    <div className="absolute top-0 left-0 w-full h-full rounded-full" style={{ backgroundColor: 'conic-gradient' }}>
                      <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold" style={{ color: 'black' }}>75%</div>
                    </div>
                  </div>
                </div>
                <div className="text-5xl">😂</div>
              </div>
              </Link>
            </div>
            <div style={{ height: '33%', width: '33%' }}>
              <div className="w-full max-w-md h-51 bg-red-500 rounded-lg p-6 text-white flex items-center justify-between shadow-lg">
                <div>
                  <h3 className="text-xl font-bold">Locations</h3>
                  <p className="text-sm">35 Lessons</p>
                  <div className="relative w-12 h-12 mt-4">
                    <div className="absolute top-0 left-0 w-full h-full rounded-full" style={{ backgroundColor: 'conic-gradient' }}>
                      <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold">75%</div>
                    </div>
                  </div>
                </div>
                <div className="text-5xl">📤</div>
              </div>
            </div>
          </div>
        </div>
      </center>
      <footer>
        <div className="top">
          <div className="logo">
            <a href="https://youtube.com/@Rishabh">Rishabh</a>
          </div>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Youtube</a></li>
            <li><a href="#">Projects</a></li>
          </ul>
          <div className="social-links">
            <a href="https://www.instagram.com/rishabh_singh1520?igsh=MWthemxrdXZxanR2OQ%3D%3D" target="_blank">
              <i className='bx bxl-instagram'></i>
            </a>
            <a href="https://www.linkedin.com/in/rishabh-gusain-1a319b299/" target="_blank">
              <i className='bx bxl-linkedin-square'></i>
            </a>
            <a href="https://twitter.com/Rishabh152022" target="_blank">
              <i className='bx bxl-twitter'></i>
            </a>
            <a href="https://www.facebook.com/RishabhGusain1520" target="_blank">
              <i className='bx bxl-facebook-square'></i>
            </a>
          </div>
        </div>
        <div className="separator"></div>
        <div className="bottom">
          <p>&copy; Rishabh Gusain. All rights reserved.</p>
          <div className="links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookies Setting</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
