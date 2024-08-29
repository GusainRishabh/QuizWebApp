import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EditProfile from './editprofile';


function Hamburger() {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <img src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="user photo" onClick={handleToggle} className="flex items-center justify-center w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full" />
            {isOpen && (
                <div
                    className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-md py-2"
                    id="user-dropdown"
                >
                    <div className="px-4 py-3">
                        <span className="block text-sm text-gray-900 dark:text-white">Rishabh Gusain</span>
                        <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">name@rishabh.com</span>
                    </div>
                    <ul className="py-2" aria-labelledby="user-menu-button">
                        <li>
                            <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                            <Link to="/myprofile">My Profile</Link>

                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                                <Link to="/EditProfile">Edit Profile</Link>

                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                                Delete
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                                Sign out
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Hamburger;