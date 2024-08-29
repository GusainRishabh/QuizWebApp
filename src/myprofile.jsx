import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyProfile() {
  const [userInfo, setUserInfo] = useState({});
  // const navigate = useNavigate();

  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      let response = await fetch("http://localhost:3000/editprofile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let res = await response.text();
      console.log(data, res);
      // Show success toast
      toast.success('Profile updated successfully!');
      // navigate('/Loginform');

    } catch (error) {
      console.error("Error:", error);
      // Show error toast
      toast.error('Error updating profile.');
    }
  };
  
  useEffect(() => {
    fetch('info.json')
      .then(response => response.json())
      .then(data => {
        setUserInfo(data[0]);
        // Set default values using setValue
        setValue('t1', data[0].Academy_Name);
        setValue('t2', data[0].Phone_Number);
        setValue('t3', data[0].Plan);
        setValue('t4', data[0].Company_Website);
        setValue('t5', data[0].Company_Id);
        setValue('t6', data[0].Email_Address);
        setValue('t7', data[0].Password);
      })
      .catch(error => console.error('Error fetching user info:', error));
  }, [setValue]);


  return (
    <div>
      <ToastContainer />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '600px' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '1.5rem' }}>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>Edit profile</h2>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <img src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="User Avatar" style={{ width: '3rem', height: '3rem', borderRadius: '50%', marginRight: '1rem' }} />
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'row' }}>
                  <div style={{ marginRight: '1rem', flex: '1' }}>
                    <label>Academy Name</label>
                    <input type="text" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} defaultValue={userInfo.Academy_Name} {...register('t1')} />
                  </div>
                  <div style={{ flex: '1' }}>
                    <label>Phone Number</label>
                    <input type="text" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} defaultValue={userInfo.Phone_Number} {...register('t2')} />
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Plan</label>
                  <input type="text" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} defaultValue={userInfo.Plan} {...register('t3')} readOnly />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Company Website</label>
                  <input type="text" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} defaultValue={userInfo.Company_Website} {...register('t4')} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Company ID</label>
                  <input type="text" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} defaultValue={userInfo.Company_Id} {...register('t5')} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Email</label>
                  <input type="text" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} defaultValue={userInfo.Email_Address} {...register('t6')} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Password</label>
                  <input id="password" type="text" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} defaultValue={userInfo.Password} {...register('t7')} readOnly />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '0.25rem', backgroundColor: '#3182ce', color: '#ffffff', cursor: 'pointer' }}>Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
