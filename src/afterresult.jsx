import React, { useEffect, useState } from 'react';

const ResultsSummary = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/result.json')  // Ensure the path to your JSON file is correct
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Assuming data is an object with a 'resultde' array
        setUser(data.resultde[0]);  // Set the user to the first object in the 'resultde' array
      })
      .catch(error => console.error('Error fetching user info:', error));
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-300 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Results Summary</h2>
        <div className="border-t border-gray-200 pt-4">
          <p className="text-lg text-gray-600 flex items-center">
            <strong className="mr-2">Student Name:</strong>
            <span className="text-gray-800">{user.Student_Name}</span>
          </p>
          <p className="text-lg text-gray-600 flex items-center">
            <strong className="mr-2">Student ID:</strong>
            <span className="text-gray-800">{user.Student_Id}</span>
          </p>
          <p className="text-lg text-gray-600 flex items-center">
            <strong className="mr-2">Email ID:</strong>
            <span className="text-gray-800">{user.Email_Id}</span>
          </p>
          <p className="text-lg text-gray-600 flex items-center">
            <strong className="mr-2">Total Marks:</strong>
            <span className="text-gray-800">{user.Total_Marks}</span>
          </p>
          <p className="text-lg text-gray-600 flex items-center">
            <strong className="mr-2">Attempted Questions:</strong>
            <span className="text-gray-800">{user.Attempt_questions}</span>
          </p>
          <p className="text-lg text-gray-600 flex items-center">
            <strong className="mr-2">Correct Answers:</strong>
            <span className="text-green-500">{user.Right_Answer}</span>
          </p>
          <p className="text-lg text-gray-600 flex items-center">
            <strong className="mr-2">Wrong Answers:</strong>
            <span className="text-red-500">{user.Wrong_Answer}</span>
          </p>
          <p className="text-lg text-gray-600 flex items-center">
            <strong className="mr-2">Paper Code:</strong>
            <span className="text-gray-800">{user.Paper_Code}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;
