import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function StudentDetail() {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();
  const [usersInfo, setUsersInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch('studentdetail.json')
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          setUsersInfo(data[0]);
          setValue('t1', data[0].Student_Name);
          setValue('t2', data[0].Last_Name);
          setValue('t3', data[0].Address);
          setValue('t4', data[0].Phone_Number);
          setValue('t5', data[0].Father_Name);
          setValue('t6', data[0].Student_Id);
          setValue('t7', data[0].Email_Id);
          setValue('t8', data[0].Password);
          setValue('t9', data[0].status);
        }
      })
      .catch(error => console.error('Error fetching user info:', error));
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      let response = await fetch("http://localhost:3000/conform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let result = await response.text();
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ width: '50%', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Student Name</th>
              <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{usersInfo.Student_Name || 'N/A'}</td>
            </tr>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Last Name</th>
              <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{usersInfo.Last_Name || 'N/A'}</td>
            </tr>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Address</th>
              <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{usersInfo.Address || 'N/A'}</td>
            </tr>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Phone Number</th>
              <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{usersInfo.Phone_Number || 'N/A'}</td>
            </tr>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Father Name</th>
              <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{usersInfo.Father_Name || 'N/A'}</td>
            </tr>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Student ID</th>
              <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{usersInfo.Student_Id || 'N/A'}</td>
            </tr>
            <input
              id="text"
              type="text"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
              {...register('t6')}
              readOnly hidden
            />
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Email</th>
              <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{usersInfo.Email_Id || 'N/A'}</td>
            </tr>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Current Status</th>
              <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{usersInfo.status || 'N/A'}</td>
            </tr>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Change Status</th>
              <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                <select {...register('a1')}>
                  <option>Success</option>
                  <option>Cancel</option>
                  <option>Pending</option>
                </select>
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Click on Submit For Change Status</th>
              <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default StudentDetail;
