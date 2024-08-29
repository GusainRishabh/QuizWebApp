import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AcademySection from './academysection';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function AdminAfterLogin() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/totalacademy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        navigate('/totalacademysection');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error processing request');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error submitting request');
    }
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-gray-800 border-b border-gray-700 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button 
                data-drawer-target="logo-sidebar" 
                data-drawer-toggle="logo-sidebar" 
                aria-controls="logo-sidebar" 
                type="button" 
                className="inline-flex items-center p-2 text-sm text-gray-400 rounded-lg sm:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
                </svg>
              </button>
              <a href="https://flowbite.com" className="flex ms-2 md:me-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white"></span>
              </a>
            </div>
            <div className="flex items-center">
              <button 
                type="button" 
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" 
                aria-expanded="false" 
                data-dropdown-toggle="dropdown-user">
                <span className="sr-only">Open user menu</span>
                <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
              </button>
              <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
                <div className="px-4 py-3" role="none">
                  <p className="text-sm text-gray-900 dark:text-white" role="none"></p>
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">neil.sims@flowbite.com</p>
                </div>
                <ul className="py-1" role="none">
                  <li><a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</a></li>
                  <li><a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Settings</a></li>
                  <li><a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Earnings</a></li>
                  <li><a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Sign out</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex pt-16">
        <aside id="logo-sidebar" className="aside top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-gray-800 border-r border-gray-700 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
          <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-800 dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              <li>
                <a href="#" className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group">
                  <svg className="w-5 h-5 text-gray-400 transition duration-75 group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                  </svg>
                  <span className="ms-3"><Link to="/adminafterlogin">Blog</Link></span>
                </a>
              </li>
              <li>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <button type="submit" className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group w-full">
                    <svg className="flex-shrink-0 w-5 h-5 text-gray-400 transition duration-75 group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                      <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286C10 17.169 10.831 18 11.857 18h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                    </svg>
                    <span className="flex-1 ms-3 text-left whitespace-nowrap">Submit Academy</span>
                  </button>
                </form>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-400 transition duration-75 group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                    <path d="M15 4h-3V3a3 3 0 0 0-6 0v1H3a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3ZM7 3a1 1 0 0 1 2 0v1H7V3Zm4 4H7V5h4v2Zm4 9H3v-1h12v1Zm0-4H3v-2h12v2Z" />
                  </svg>
                  <Link to="/postblog">
                  <span className="flex-1 ms-3 whitespace-nowrap">Post Blog</span>

                  </Link>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-400 transition duration-75 group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 16">
                    <path d="M1 16h16V4H1v12Zm0-14h16V1a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v1Z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                  <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-blue-600 bg-blue-200 rounded-full dark:bg-blue-900 dark:text-blue-200">3</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-400 transition duration-75 group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                    <path d="M9 18a2 2 0 0 0 2-2H7a2 2 0 0 0 2 2ZM5.109 3.775l.395-.833A2 2 0 0 1 7.335 2h3.33a2 2 0 0 1 1.831 1.168l.395.833 1.713.342c.944.188 1.64 1.048 1.64 2.012v6.905c0 1.16-.914 2.095-2.059 2.095H3.455c-1.145 0-2.059-.935-2.059-2.095V6.13c0-.964.696-1.824 1.64-2.012l1.713-.343Z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Notifications</span>
                </a>
              </li>
            </ul>
          </div>
        </aside>
        <main className="flex-1 ml-64 h-screen overflow-y-auto">
          {/* Render BlogView component */}
            <AcademySection />
        </main>
      </div>
    </>
  );
}

export default AdminAfterLogin;
