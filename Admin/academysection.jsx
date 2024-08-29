import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { color } from 'framer-motion';

const AcademySection = () => {
  const [academies, setAcademies] = useState([]);
  const [expandedAcademy, setExpandedAcademy] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [pendingStatus, setPendingStatus] = useState({});

  useEffect(() => {
    axios.get('/totalacademy.json')
      .then(response => {
        setAcademies(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
        toast.error("Failed to load academies");
      });
  }, []);

  const toggleExpandAcademy = (index) => {
    setExpandedAcademy(expandedAcademy === index ? null : index);
  };

  const handleStatusChange = (academyId, status) => {
    setPendingStatus(prev => ({ ...prev, [academyId]: status }));
  };

  const handleSubmitStatusChange = async (academyId) => {
    const status = pendingStatus[academyId];
    if (!status) {
      toast.error("Please select a status before submitting");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/changestatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ academyId, status }),
      });

      if (response.ok) {
        const responseData = await response.json();
        toast.success(responseData.message || 'Status updated successfully!');
        setSelectedStatus(prev => ({ ...prev, [academyId]: status }));
        setPendingStatus(prev => ({ ...prev, [academyId]: '' }));
      } else {
        const responseData = await response.json();
        toast.error(responseData.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while updating the status');
    }
  };

  return (
    <section className="bg-gray-900 py-12 px-4 mx-auto max-w-screen-xl lg:py-24 lg:px-6">
      <h2 className="text-4xl font-extrabold text-white mb-8 text-center">
        Explore Our <span className="text-blue-400">Academies</span>
      </h2>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {academies.length === 0 ? (
          <p className="text-gray-400 text-center col-span-full">No academies available</p>
        ) : (
          academies.map((academy, index) => (
            <div key={index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{academy.Academy_Name}</h3>
                <p className="text-gray-400 mb-4"><strong>Plan:</strong> {academy.Plan}</p>
                <p className="text-gray-400 mb-4 back"><strong>Subscription Status:</strong>{academy.subscription_status}</p>
                <p className="text-gray-400 mb-4 truncate"><strong>Website:</strong> {academy.Company_Website}</p>
                <a href={`mailto:${academy.Email_Address}`} className="text-blue-400 hover:underline">
                  Contact: {academy.Email_Address}
                </a>
                <div className="mt-4 flex flex-col items-start space-y-2">
                  <p className="text-gray-300">Note: Select a status from the dropdown and click "Submit" to apply the changes.</p>
                  <select
                    id="action-select"
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-36 p-2.5"
                    value={pendingStatus[academy.Company_Id] || ''}
                    onChange={(e) => handleStatusChange(academy.Company_Id, e.target.value)}
                  >
                    <option value="">Actions</option>
                    <option value="Block">Block</option>
                    <option value="Cancel">Cancel</option>
                    <option value="Success">Success</option>
                  </select>
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleSubmitStatusChange(academy.Company_Id)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-400 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => toggleExpandAcademy(index)}
                      className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300"
                    >
                      {expandedAcademy === index ? 'View Less' : 'View More'}
                    </button>
                  </div>
                </div>
                {expandedAcademy === index && (
                  <div className="mt-4 text-gray-400 space-y-2">
                    <p><strong>Phone Number:</strong> {academy.Phone_Number}</p>
                    <p><strong>Company ID:</strong> {academy.Company_Id}</p>
                    <p><strong>Subscription Start:</strong> {academy.subscription_start}</p>
                    <p><strong>Subscription End:</strong> {academy.subscription_end}</p>
                    <p><strong>OTP:</strong> {academy.otp}</p>
                    <p><strong>OTP Created At:</strong> {academy.otp_created_at}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default AcademySection;
