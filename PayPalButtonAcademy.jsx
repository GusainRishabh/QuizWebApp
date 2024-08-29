import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const PayPalButton = ({ amount }) => {
  const { register, setValue } = useForm();
  const navigate = useNavigate();
  const [transactionState, setTransactionState] = useState({ success: false, error: false, message: '' });
  const [companyId, setCompanyId] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDetailsValid, setIsDetailsValid] = useState(false);

  useEffect(() => {
    fetch('CompanyDetails.json')
      .then(response => response.json())
      .then(data => {
        if (data && data.academy && data.academy.length > 0 && data.paypal_credentials && data.paypal_credentials.length > 0) {
          const companyInfo = data.academy[0];
          const paypalInfo = data.paypal_credentials[0];
          setCompanyId(companyInfo.Company_Id);
          setClientId(paypalInfo.client_id);
          setClientSecret(paypalInfo.client_secret);

          // Set form values
          setValue('Company_Id', companyInfo.Company_Id);
          setValue('client_id', paypalInfo.client_id);
          setValue('client_secret', paypalInfo.client_secret);

          // Check if details are valid
          setIsDetailsValid(companyInfo.Company_Id && paypalInfo.client_id && paypalInfo.client_secret);
          setLoading(false);
        } else {
          console.error('Invalid data format in CompanyDetails.json');
          setTransactionState({ success: false, error: true, message: 'Invalid Academy' });
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
        setTransactionState({ success: false, error: true, message: 'Error fetching company details.' });
        setLoading(false);
      });
  }, [setValue]);

  const handleTransaction = async (orderId, amount, payerEmail, status) => {
    try {
      const response = await fetch('http://localhost:3000/api/transactionacademy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, amount, payerEmail, status, Company_Id: companyId, client_id: clientId, client_secret: clientSecret }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from server:', errorText);
        setTransactionState({ success: false, error: true, message: `Failed to save transaction data: ${errorText}` });
        throw new Error('Failed to save transaction data');
      }

      console.log('Transaction data saved successfully');
      setTransactionState({ success: true, error: false, message: 'Transaction data saved successfully' });
    } catch (err) {
      console.error('Error saving transaction data:', err);
      setTransactionState({ success: false, error: true, message: `Error saving transaction data: ${err.message}` });
      navigate('/Failed', { state: { error: err.message } });
    }
  };

  return (
    <PayPalScriptProvider options={{ "client-id": clientId }}>
      <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
        {/* Conditionally render the form fields */}
        {!loading ? (
          isDetailsValid ? (
            <>
              <form>
                <div style={{ marginBottom: '10px' }}>
                  <label htmlFor="Company_Id">Company Id:</label>
                  <input
                    type="text"
                    id="Company_Id"
                    {...register('Company_Id')}
                    value={companyId}
                    readOnly
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label htmlFor="client_id">Client Id:</label>
                  <input
                    type="text"
                    id="client_id"
                    {...register('client_id')}
                    value={clientId}
                    readOnly
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label htmlFor="client_secret">Client Secret:</label>
                  <input
                    type="text"
                    id="client_secret"
                    {...register('client_secret')}
                    value={clientSecret}
                    readOnly
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                  />
                </div>
              </form>

              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [{ amount: { value: amount } }],
                  }).then(orderId => {
                    console.log('Order created:', orderId);
                    return orderId;
                  }).catch(err => {
                    console.error('Error creating order:', err);
                    setTransactionState({ success: false, error: true, message: 'Failed to create PayPal order' });
                    navigate('/Failed', { state: { error: 'Failed to create PayPal order' } });
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then(details => {
                    console.log('Order captured:', details);
                    const { id: orderId } = details;
                    const payerEmail = details.payer.email_address;
                    return handleTransaction(orderId, amount, payerEmail, 'success').then(() => {
                      if (!transactionState.error) {
                        navigate('/Success', { state: { details } });
                      }
                    });
                  }).catch(err => {
                    console.error('Error capturing order or handling transaction:', err);
                    setTransactionState({ success: false, error: true, message: err.message });
                    handleTransaction(data.orderID, amount, data.payer.email_address, 'failure');
                    navigate('/Failed', { state: { error: err.message } });
                  });
                }}
                onError={(err) => {
                  console.error('PayPal Buttons onError:', err);
                  setTransactionState({ success: false, error: true, message: err.message || 'An error occurred with the PayPal transaction.' });
                  handleTransaction(data.orderID, amount, data.payer.email_address, 'failure');
                  navigate('/Failed', { state: { error: err.message || 'An error occurred with the PayPal transaction.' } });
                }}
              />
            </>
          ) : (
            <p style={{ color: 'red' }}>Academy details are not available.</p>
          )
        ) : (
          <p style={{ color: 'red' }}>Loading payment details...</p>
        )}

        {transactionState.success && <p style={{ color: 'green' }}>{transactionState.message}</p>}
        {transactionState.error && <p style={{ color: 'red' }}>{transactionState.message}</p>}
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
