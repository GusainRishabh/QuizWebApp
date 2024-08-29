import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEdit, FaTrash, FaBell, FaSignOutAlt } from 'react-icons/fa'; // Import icons from react-icons

function Hamburger() {
    const [isOpen, setIsOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        fetch('student.json')
            .then(response => response.json())
            .then(data => {
                setImageUrl(data[0].file_path); // Set the image URL
            })
            .catch(error => console.error('Error fetching user info:', error));
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            <img
                src={imageUrl}
                alt="User Avatar"
                style={{
                    width: '70px', height: '70px', borderRadius: '50%', marginRight: '1rem', border: '2px solid #333', boxShadow: '0 4px 8px rgba(0,0,0,0.5)', cursor: 'pointer'
                }}
                onClick={handleToggle}
            />
            {isOpen && (
                <div
                    className="absolute top-12 right-0 w-48 bg-gray-800 rounded-lg shadow-md py-2"
                    id="user-dropdown"
                >
                    <div className="px-4 py-3">
                        <span className="block text-sm text-white">Rishabh Gusain</span>
                        <span className="block text-sm text-gray-400 truncate">name@rishabh.com</span>
                    </div>
                    <ul className="py-2" aria-labelledby="user-menu-button">
                        <li>
                            <Link
                                to="/studentprofile"
                                className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white"
                            >
                                <FaUser className="mr-2" /> My Profile
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/EditProfile"
                                className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white"
                            >
                                <FaEdit className="mr-2" /> Edit Profile
                            </Link>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white"
                            >
                                <FaTrash className="mr-2" /> Delete
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white"
                            >
                                <FaBell className="mr-2" /> Notification
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white"
                            >
                                <FaSignOutAlt className="mr-2" /> Sign out
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Hamburger;
