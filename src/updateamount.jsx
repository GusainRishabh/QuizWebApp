import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

// Inline styles
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: 'auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '16px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '10px',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  errorText: {
    color: '#dc3545',
    fontSize: '14px',
    marginTop: '4px',
  },
  message: {
    marginTop: '20px',
    fontSize: '16px',
    textAlign: 'center',
  },
};

function UpdatePaymentAmount() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/update-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Payment amount updated successfully');
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      setMessage('Error updating payment');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Update Payment Amount</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={styles.formGroup}>
          <label htmlFor="userId" style={styles.label}>User ID:</label>
          <input
            id="userId"
            {...register('userId', { required: 'User ID is required' })}
            placeholder="Enter your user ID"
            style={styles.input}
          />
          {errors.userId && <span style={styles.errorText}>{errors.userId.message}</span>}
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="newAmount" style={styles.label}>New Payment Amount (₹):</label>
          <input
            id="newAmount"
            type="number"
            {...register('newAmount', { required: 'New amount is required', min: { value: 0, message: 'Amount must be greater than zero' } })}
            placeholder="Enter new amount"
            style={styles.input}
          />
          {errors.newAmount && <span style={styles.errorText}>{errors.newAmount.message}</span>}
        </div>

        <button
          type="submit"
          style={{ ...styles.button, ...(isSubmitting ? styles.buttonHover : {}) }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Payment'}
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
}

export default UpdatePaymentAmount;
