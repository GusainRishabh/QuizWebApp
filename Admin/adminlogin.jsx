import React from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/adminlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resText = await response.text();
      console.log(data, resText);

      if (response.ok) {
        toast.success('Login successful');
        navigate('/adminafterlogin');
      } else {
        toast.error('Login failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <form style={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h2 style={styles.header}>Admin Login</h2>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            type="text"
            id="email"
            style={styles.input}
            placeholder="Enter your email"
            {...register('t1', { required: true })}
          />
          {errors.email && <p style={styles.error}>Email is required</p>}
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            style={styles.input}
            placeholder="Enter your password"
            {...register('t2', { required: true })}
          />
          {errors.password && <p style={styles.error}>Password is required</p>}
        </div>
        <div style={styles.checkboxGroup}>
          <input
            id="remember"
            type="checkbox"
            style={styles.checkbox}
          />
          <label htmlFor="remember" style={styles.checkboxLabel}>Remember me</label>
        </div>
        <button type="submit" style={styles.button} disabled={isSubmitting}>
          Submit
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: '20px',
  },
  form: {
    backgroundColor: '#1e1e1e',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '400px',
    animation: 'fadeIn 1s ease-in-out',
  },
  header: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: '30px',
    fontSize: '24px',
    fontWeight: '600',
    borderBottom: '2px solid #6200ea',
    paddingBottom: '10px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#e0e0e0',
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #333',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
  },
  checkbox: {
    marginRight: '10px',
    width: '18px',
    height: '18px',
    border: '1px solid #333',
    backgroundColor: '#2a2a2a',
    cursor: 'pointer',
  },
  checkboxLabel: {
    color: '#e0e0e0',
    fontSize: '14px',
  },
  button: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#6200ea',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  error: {
    color: '#f44336',
    fontSize: '12px',
    marginTop: '5px',
  }
};

export default AdminLogin;
