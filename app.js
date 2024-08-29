import express, { response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { authenticator } from 'otplib';
import { Result } from 'postcss';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcryptjs'
import * as paypal from '@paypal/checkout-server-sdk';
import Razorpay from 'razorpay'
import dotenv from 'dotenv'
import { Server } from "socket.io";
import crypto from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url));


// Set up Express app
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Database setup
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Tech',
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rishabhgusain51@gmail.com', // Replace with your Gmail address
    pass: 'csgq nwsf eqtp azvv'     // Replace with your Gmail app password
  },
});

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Route to create an order
app.post('/create-orderrazer', async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ success: false, message: 'Error creating order' });
  }
});

// Route to verify payment
app.post('/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET; // Use your Razorpay Secret Key

  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const expectedSignature = shasum.digest('hex');

  try {
    const connection = await pool.getConnection();

    // Insert payment details into the database with status 'pending'
    await connection.query(
      'INSERT INTO payments (order_id, payment_id, signature, status) VALUES (?, ?, ?, ?)',
      [razorpay_order_id, razorpay_payment_id, razorpay_signature, 'pending']
    );

    if (razorpay_signature === expectedSignature) {
      // Update payment status to 'success'
      await connection.query(
        'UPDATE payments SET status = ? WHERE order_id = ?',
        ['success', razorpay_order_id]
      );
      res.json({ msg: 'Captured' });
    } else {
      // Update payment status to 'failed'
      await connection.query(
        'UPDATE payments SET status = ? WHERE order_id = ?',
        ['failed', razorpay_order_id]
      );
      res.status(400).json({ msg: 'Failure' });
    }

    connection.release();
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    res.status(500).json({ msg: 'Error verifying payment' });
  }
});


const environment = new paypal.core.SandboxEnvironment(
  'AYsD4EzuPuEYIfd1jEmJgMFwVfkhomjNl4d_ste-ZNKMAOTEgDCU2_7BHxz_UYldpTq0x8NdK5L6bkRD',
  'EGCWFbGsyq7J6g3OqBxo4g6A4UHgQNSYU3fHoufjdf35cWGQascknKFT-sw9gV-YHykJlhm_Jh6TKJEc'
);
const client = new paypal.core.PayPalHttpClient(environment);

// Endpoint to create PayPal order
app.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: amount,
      },
    }],
  });

  try {
    const response = await client.execute(request);
    res.status(200).json({ orderId: response.result.id });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ error: 'Failed to create PayPal order.' });
  }
});

// Endpoint to save transaction data

app.get('/api/paypal-details', (req, res) => {
  const filePath = path.join(__dirname, 'CompanyDetails.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ message: 'Error fetching PayPal details' });
    }
 
    try {
      const companyDetails = JSON.parse(data);
      const { academy, paypal_credentials } = companyDetails;
      
      if (academy && academy.length > 0 && paypal_credentials && paypal_credentials.length > 0) {
        const companyInfo = academy[0];
        const paypalInfo = paypal_credentials[0];
        res.json({
          Company_Id: companyInfo.Company_Id,
          client_id: paypalInfo.client_id,
          client_secret: paypalInfo.client_secret,
        });
      } else {
        res.status(400).json({ message: 'Invalid data format in CompanyDetails.json' });
      }
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ message: 'Error processing PayPal details' });
    }
  });
});



/// admin info

app.post('/adminlogin', async (req, res) => {
  const { t1, t2 } = req.body;

  let connection;
  try {
    connection = await pool.getConnection();
    const query = 'SELECT * FROM admin WHERE userId = ? AND Password = ?';
    const [rows] = await connection.execute(query, [t1, t2]);

    if (rows.length > 0) {
      const admin = rows[0]; // The admin record retrieved from the database
      
      // Send a success response to the client
      res.status(200).json({ message: 'Login successful', admin });

      // Save the admin data to a JSON file
      const jsonString = JSON.stringify(rows, null, 2); // Pretty-print JSON for better readability
      const filePath = 'admin.json';

      fs.writeFile(filePath, jsonString, 'utf8', (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return;
        }
        console.log('JSON data has been saved to', filePath);
      });
    } else {
      res.status(401).send('Login failed: invalid userId or Password');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error: ' + err.message });
  } finally {
    if (connection) connection.release(); // Ensure connection is released in both success and error cases
  }
}); 

// Endpoint to handle the transaction

// Backend endpoint for saving transaction data
// Assuming you have `pool` from a database connection pool

app.post('/api/transaction', async (req, res) => {
  const { orderId, amount, payerEmail, status } = req.body;

  if (!orderId || !amount || !payerEmail || !status) {
    return res.status(400).send('Missing required fields');
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO transactions (order_id, amount, payer_email, status) VALUES (?, ?, ?, ?)',
      [orderId, amount, payerEmail, status]
    );
    res.status(200).send('Transaction data saved');
  } catch (err) {
    console.error('Error saving transaction data:', err); // Log the full error
    res.status(500).send('Error saving transaction data');
  } finally {
    if (connection) {
      connection.release();
    }
  }
});



/// Acasdemy Section

async function getPayPalCredentials(academy_id) {
  const [rows] = await db.query('SELECT client_id, client_secret FROM paypal_credentials WHERE academy_id = ?', [academy_id]);
  return rows[0];
}

// Endpoint to create PayPal order
app.post('/create-order-academy', async (req, res) => {
  const { amount, academy_id } = req.body;

  try {
    // Fetch PayPal credentials
    const { client_id, client_secret } = await getPayPalCredentials(academy_id);

    // Initialize PayPal environment with dynamic credentials
    const environment = new paypal.core.SandboxEnvironment(client_id, client_secret);
    const client = new paypal.core.PayPalHttpClient(environment);

    // Create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount,
        },
      }],
    });

    const response = await client.execute(request);
    res.status(200).json({ orderId: response.result.id });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ error: 'Failed to create PayPal order.' });
  }
});



// Function to fetch PayPal credentials from the database



const jsonFilePath = path.join(__dirname, 'CompanyDetails.json');

// Helper function to get PayPal client from JSON file
async function getPayPalClient() {
  try {
    const data = fs.readFileSync(jsonFilePath, 'utf8');
    const jsonData = JSON.parse(data);

    if (jsonData.paypal_credentials.length === 0) {
      throw new Error('PayPal credentials not found in JSON file');
    }

    const { client_id, client_secret } = jsonData.paypal_credentials[0];

    // Create PayPal environment and client
    const environment = new paypal.core.SandboxEnvironment(client_id, client_secret);
    return new paypal.core.PayPalHttpClient(environment);
  } catch (error) {
    console.error('Error reading PayPal credentials from JSON file:', error);
    throw new Error('Failed to create PayPal client');
  }
}

// Route to fetch company and PayPal details
app.get('/api/company-details', (req, res) => {
  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    try {
      const jsonData = JSON.parse(data);
      if (jsonData.academy.length === 0 || jsonData.paypal_credentials.length === 0) {
        return res.status(404).json({ error: 'Data not found' });
      }

      res.json(jsonData);
    } catch (error) {
      console.error('Error parsing JSON file:', error);
      res.status(500).json({ error: 'Error parsing JSON file' });
    }
  });
});

// Create a PayPal order
app.post('/api/create-order', async (req, res) => {
  const { amount } = req.body;

  try {
    const paypalClient = await getPayPalClient();
    const request = new paypal.orders.OrdersCreateRequest();
    request.headers['prefer'] = 'return=representation';
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount
          }
        }
      ]
    });

    const response = await paypalClient.execute(request);
    res.json({ id: response.result.id });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// Capture a PayPal order
app.post('/api/capture-order', async (req, res) => {
  const { orderId } = req.body;

  try {
    const paypalClient = await getPayPalClient();
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await paypalClient.execute(request);
    res.json(response.result);
  } catch (err) {
    console.error('Error capturing order:', err);
    res.status(500).json({ error: 'Failed to capture PayPal order' });
  }
});

// Route to handle PayPal transaction
app.post('/api/transactionacademy', async (req, res) => {
  const { orderId, amount, payerEmail, status } = req.body;

  if (!orderId || !amount || !payerEmail || !status) {
    return res.status(400).send('Missing required fields');
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO academytransactiondetails (order_id, amount, payer_email, status) VALUES (?, ?, ?, ?)',
      [orderId, amount, payerEmail, status]
    );
    res.status(200).send('Transaction data saved');
  } catch (err) {
    console.error('Error saving transaction data:', err); // Log the full error
    res.status(500).send('Error saving transaction data');
  } finally {
    if (connection) {
      connection.release();
    }
  }
});



//// Academy Section
// Handle form submission and send OTP email

const saltRounds = 10; // Adjust the salt rounds as needed

app.post('/form', async (req, res) => {
  const { t1, t2, t3, t4, t5, t6, t7 } = req.body;
  const otp = authenticator.generate('secret-key'); // Generate OTP
  const currentDateTime = new Date().toLocaleString(); // Get current datetime
  const otpCreatedAt = new Date(); // OTP creation time
  const subscription_start = new Date(); // Subscription start time
  const subscription_end = new Date(subscription_start.getTime() + 30 * 24 * 60 * 60 * 1000); // Subscription end time (30 days later)
  const subscription_status = 'pending'; // Subscription status

  try {
    const connection = await pool.getConnection();

    const query = 'INSERT INTO academy(Academy_Name, Phone_Number, Plan, Company_Website, Company_Id, Email_Address, Password, otp, otp_created_at, subscription_start, subscription_end, subscription_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'; // Insert query

    await connection.execute(query, [t1, t2, t3, t4, t5, t6, t7, otp, otpCreatedAt, subscription_start, subscription_end, subscription_status]);

    connection.release();

    const mailOptions = {
      from: '"Rishabh Gusain" <rishabhgusain51@gmail.com>',
      to: t6,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="text-align: center; color: #0044cc;">Sand Box</h2>
        <p style="font-size: 16px;">Dear User,</p>
        <p style="font-size: 16px;">Your OTP code is:</p>
        <div style="text-align: center; font-size: 24px; font-weight: bold; color: #0044cc; margin: 20px 0;">
          ${otp}
        </div>
        <p style="font-size: 16px;">This code is valid for 5 minutes.</p>
        <p style="font-size: 16px;">If you did not request this code, please ignore this email or contact support if you have any concerns.</p>
        <p style="font-size: 16px;">Time of request: ${currentDateTime}</p>
        <p style="font-size: 16px;">Thank you,</p>
        <p style="font-size: 16px;">Sand Box </p>
      </div>
      `,
    };


    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending OTP email');
        return;
      }
      console.log('Email sent:', info.response);
      res.status(200).send('success');
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Database error: ' + err);
  }
});



// API endpoint to handle OTP verification
// API endpoint to handle OTP verification
app.post('/verify-otp', async (req, res) => {
  const { otp } = req.body;
  const currentDateTime = new Date();
  const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

  try {
    const connection = await pool.getConnection();
    const query = 'SELECT * FROM academy WHERE otp = ?';
    const [rows] = await connection.execute(query, [otp]);

    if (rows.length > 0) {
      const otpCreatedAt = new Date(rows[0].otp_created_at);
      const timeDifference = currentDateTime - otpCreatedAt;

      if (timeDifference <= fiveMinutes) {
        res.send('success');
      } else {
        res.send('otp_expired'); // Changed to match the expected response on the frontend
      }
    } else {
      res.send('invalid_otp'); // Changed to a more specific response for invalid OTP
    }
    connection.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error: ' + err);
  }
});


// API endpoint to handle second form submission
app.post('/form2', async (req, res) => {
  const { t1, t2 } = req.body;

  if (!t1 || !t2) {
    return res.status(400).json({ message: 'Both Company_Id and Password are required' });
  }

  let connection;

  try {
    connection = await pool.getConnection();
    const query = 'SELECT * FROM academy WHERE Company_Id = ? AND Password = ?';
    const [rows] = await connection.execute(query, [t1, t2]);

    if (rows.length === 0) {
      connection.release();
      return res.status(400).json({ message: 'Invalid Company_Id or Password' });
    }

    const subscription_end = new Date(rows[0].subscription_end);
    const subscription_status = rows[0].subscription_status; // Get subscription status
    const currentDate = new Date();
    
    console.log("Current Date: " + currentDate);
    console.log("Expire Date: " + subscription_end);
    console.log("Subscription Status: " + subscription_status);

    // Check if the subscription status is "pending"
    if (subscription_status === 'pending') {
      connection.release();
      console.log("Subscription Status Is Pending");
      return res.status(403).json({ message: 'Subscription is pending, login not allowed' });
    }

    const jsonString = JSON.stringify(rows);
    const filePath = 'info.json';
    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        connection.release();
        return res.status(500).json({ message: 'Error writing file' });
      }
      console.log('JSON data has been saved to', filePath);
      
      if (subscription_end > currentDate) {
        connection.release();
        console.log("Subscription Is Valid");
        return res.json({ status: 'valid' });
      } else {
        connection.release();
        console.log("Subscription Is Invalid");
        return res.json({ status: 'expired' });
      }
    });

  } catch (err) {
    if (connection) connection.release(); // Ensure connection is released in case of error
    console.error(err);
    return res.status(500).json({ message: 'Database error: ' + err });
  }
});




// Repeated form handling endpoints (form3, form4, form5) optimized for clarity
const handleFormSubmission = async (req, res, planValue) => {
  try {
    const connection = await pool.getConnection();
    const query = 'INSERT INTO plan(plan) VALUES (?)';
    await connection.execute(query, [planValue]);

    const selectQuery = 'SELECT * FROM plan';
    const [rows] = await connection.execute(selectQuery);

    const jsonString = JSON.stringify(rows);
    const filePath = 'plan.json';

    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('JSON data has been saved to', filePath);
    });

    const deleteQuery = 'DELETE FROM plan';
    await connection.execute(deleteQuery);

    connection.release();
    res.redirect('/studentdashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error: ' + err);
  }
};

app.post('/form3', (req, res) => handleFormSubmission(req, res, req.body.t1));
app.post('/form4', (req, res) => handleFormSubmission(req, res, req.body.t2));
app.post('/form5', (req, res) => handleFormSubmission(req, res, req.body.t3));

// Edit profile endpoint
app.post('/editprofile', async (req, res) => {
  try {
    const { t1, t2, t3, t4, t5, t6, t7 } = req.body;

    const connection = await pool.getConnection();
    const query = 'UPDATE academy SET Academy_Name=?, Phone_Number=?, Plan=?, Company_Website=?, Company_Id=?, Email_Address=? WHERE Password=?';
    await connection.execute(query, [t1, t2, t3, t4, t5, t6, t7]);

    connection.release();

    res.send('Profile updated successfully');
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).send('Internal server error');
  }
});


//// Question Section

app.post('/question', async (req, res) => {
  const { Paper_Code, Serial_Number, Section, Add_Question, Option_1, Option_2, Option_3, Option_4, Right_Answer, Company_Id } = req.body;

  try {
    const connection = await pool.getConnection();
    const query = `
      INSERT INTO question (Paper_Code, Serial_Number, Section, Add_Question, Option_1, Option_2, Option_3, Option_4, Right_Answer, Company_Id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await connection.execute(query, [Paper_Code, Serial_Number, Section, Add_Question, Option_1, Option_2, Option_3, Option_4, Right_Answer, Company_Id]);

    connection.release();

    res.json({ status: 'success', message: 'Question inserted successfully' });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});




// Route to handle editing a question
app.post('/api/editProduct/:Company_Id/:Serial_Number', async (req, res) => {
  const { Company_Id, Serial_Number } = req.params;
  const { Paper_Code, Section, Add_Question, Option_1, Option_2, Option_3, Option_4, Right_Answer } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Update query
    const updateQuery = `
      UPDATE question
      SET Paper_Code = ?, Section = ?, Add_Question = ?, Option_1 = ?, Option_2 = ?, Option_3 = ?, Option_4 = ?, Right_Answer = ?
      WHERE Company_Id = ? AND Serial_Number = ?`;

    const [updateResult] = await connection.execute(updateQuery, [
      Paper_Code,
      Section,
      Add_Question,
      Option_1,
      Option_2,
      Option_3,
      Option_4,
      Right_Answer,
      Company_Id,
      Serial_Number
    ]);

    // Check if update was successful
    if (updateResult.affectedRows > 0) {
      // Fetch the updated question
      const selectQuery = `
        SELECT * FROM question
        WHERE Company_Id = ? AND Serial_Number = ?`;
      const [rows] = await connection.execute(selectQuery, [Company_Id, Serial_Number]);

      // Create a JSON file with the updated question data
      const updatedQuestion = rows[0];
      const filePath = path.join(__dirname, 'questionjson.json');
      fs.writeFileSync(filePath, JSON.stringify(updatedQuestion, null, 2), 'utf8');

      await connection.end();

      // Send the updated question data as response
      res.json({ success: true, data: updatedQuestion });
    } else {
      await connection.end();
      res.json({ success: false, message: 'No rows updated' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Error updating product' });
  }
});

//// End



app.post('/sliver', async (req, res) => {
  const { t1 } = req.body;
  try {
    const connection = await pool.getConnection();

    const insertQuery = 'INSERT INTO studentplan(plan) VALUES (?)';
    await connection.execute(insertQuery, [t1]);

    const selectQuery = 'SELECT * FROM studentplan';
    const [rows, fields] = await connection.execute(selectQuery);

    connection.release();

    // Respond with success message
    res.status(200).send({ message: 'Data inserted successfully' });

    // Write the JSON data to the file
    const jsonString = JSON.stringify(rows);
    const filePath = 'studentplan.json';
    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('JSON data has been saved to', filePath);
      
    });
    const deleteQuery = 'DELETE FROM studentplan';
    await connection.execute(deleteQuery);
  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).send('Internal server error');
  }
});


app.post('/gold', async (req, res) => {
  const { t2 } = req.body;
  try {
    const connection = await pool.getConnection();

    const insertQuery = 'INSERT INTO studentplan(plan) VALUES (?)';
    await connection.execute(insertQuery, [t2]);

    const selectQuery = 'SELECT * FROM studentplan';
    const [rows, fields] = await connection.execute(selectQuery);

    connection.release();

    // Respond with success message
    res.status(200).send({ message: 'Data inserted successfully' });

    // Write the JSON data to the file
    const jsonString = JSON.stringify(rows);
    const filePath = 'studentplan.json';
    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('JSON data has been saved to', filePath);
      
    });
    const deleteQuery = 'DELETE FROM studentplan';
    await connection.execute(deleteQuery);
  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).send('Internal server error');
  }
});




app.post('/fetchacademy', async (req, res) => {
  try {
      // Replace 'academy_name' with the correct column name
      const [rows] = await pool.query('SELECT * FROM academy ORDER BY academy_name ASC');

      // Convert the result to a JSON string
      const jsonContent = JSON.stringify(rows, null, 2);

      // Define the path to save the JSON file
      const filePath = path.join(__dirname, 'academy_data.json');

      // Write the JSON string to a file
      fs.writeFile(filePath, jsonContent, 'utf8', (err) => {
          if (err) {
              console.error('Error writing JSON to file:', err);
              res.status(500).json({ error: 'An error occurred while saving data' });
          } else {
              console.log('JSON file has been saved.');
              res.json({ message: 'Data saved to academy_data.json', data: rows });
          }
      });
  } catch (error) {
      console.error('Error fetching data from academy:', error);
      res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.post('/totalacademy', async (req, res) => {
  try {
      // Fetch data from the 'academy' table
      const [rows] = await pool.query('SELECT * FROM academy');

      // Convert the result to a JSON string
      const jsonContent = JSON.stringify(rows, null, 2);

      // Define the path to save the JSON file
      const filePath = path.join(__dirname, 'totalacademy.json');

      // Write the JSON string to a file
      fs.writeFile(filePath, jsonContent, 'utf8', (err) => {
          if (err) {
              console.error('Error writing JSON to file:', err);
              res.status(500).json({ error: 'An error occurred while saving data' });
          } else {
              console.log('JSON file has been saved.');
              res.json({ message: 'Data saved to totalacademy.json', data: rows });
          }
      });
  } catch (error) {
      console.error('Error fetching data from academy:', error);
      res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});



app.post('/plat', async (req, res) => {
  const { t3 } = req.body;
  try {
    const connection = await pool.getConnection();

    const insertQuery = 'INSERT INTO studentplan(plan) VALUES (?)';
    await connection.execute(insertQuery, [t3]);

    const selectQuery = 'SELECT * FROM studentplan';
    const [rows, fields] = await connection.execute(selectQuery);

    connection.release();

    // Respond with success message
    res.status(200).send({ message: 'Data inserted successfully' });

    // Write the JSON data to the file
    const jsonString = JSON.stringify(rows);
    const filePath = 'studentplan.json';
    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('JSON data has been saved to', filePath);
      
    });
    const deleteQuery = 'DELETE FROM studentplan';
    await connection.execute(deleteQuery);
  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).send('Internal server error');
  }
});
// Repeated form handling endpoints (form3, form4, form5) optimized for clarity

/// Student Regration Code


// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to parse JSON bodies
app.use(express.json());
app.post('/studentregration', upload.single('t11'), async (req, res) => {
  const { t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, Company_Id } = req.body;
  const file_path = req.file ? req.file.path : null;

  try {
    const connection = await pool.getConnection();
    const query = 'INSERT INTO student (Student_Name, Last_Name, Address, Phone_Number, Father_Name, Student_Id, Email_Id, Password, plan, status, file_path, Company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    await connection.execute(query, [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, file_path, Company_Id]);

    connection.release();

    res.send('Insert successfully');
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).send('Internal server error');
  }
});


// Student Login Code
app.post('/studentlogin', async (req, res) => {
  const { t1, t2 } = req.body;

  let connection;
  try {
    connection = await pool.getConnection();
    const query = 'SELECT * FROM student WHERE Student_Id = ? AND Password = ?';
    const [rows] = await connection.execute(query, [t1, t2]);

    if (rows.length > 0) {
      const student = rows[0];
      if (student.status === 'Success') {
        res.send('Login successfully');
      } else {
        res.send('Login failed: status is not success');
      }
    } else {
      res.send('Login failed: invalid Student_Id or Password');
    }

    const jsonString = JSON.stringify(rows);
    const filePath = 'student.json';

    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('JSON data has been saved to', filePath);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error: ' + err });
  } finally {
    if (connection) connection.release(); // Ensure connection is released in both success and error cases
  }
});

// API Endpoint to handle POST request


app.post('/api/chose', async (req, res) => {
  const { Company_Id } = req.body;

  if (!Company_Id) {
    return res.status(400).send('Company_Id is required');
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Query to get academy data based on Company_Id
    const academyQuery = 'SELECT * FROM academy WHERE Company_Id = ?';
    const [academyRows] = await connection.execute(academyQuery, [Company_Id]);

    if (academyRows.length === 0) {
      return res.status(404).send('No academy found with the given Company_Id');
    }

    // Extract academy_id from the fetched academy data
    const academy_id = academyRows[0].academy_id;

    // Query to get PayPal credentials based on academy_id
    const paypalQuery = 'SELECT * FROM paypal_credentials WHERE academy_id = ?';
    const [paypalRows] = await connection.execute(paypalQuery, [Company_Id]);

    // Combine data from both queries
    const combinedData = {
      academy: academyRows,
      paypal_credentials: paypalRows,
    };

    const filePath = path.join(__dirname, 'CompanyDetails.json');

    // Write the combined data to a JSON file
    fs.writeFile(filePath, JSON.stringify(combinedData, null, 2), (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
        return res.status(500).send('Error writing JSON file');
      }
      console.log('JSON file created successfully:', filePath);
      res.json(combinedData); // Send combined data as JSON response
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Database error: ' + err.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
});



app.post('/viewpaper', async (req, res) => {
  const { section } = req.body;

  if (!section) {
    return res.status(400).send('Section is required');
  }

  try {
    const connection = await pool.getConnection();
    // Use the section parameter in the query
    const query = 'SELECT * FROM question WHERE Section = ?';
    const [rows] = await connection.execute(query, [section]);
    connection.release();

    const filePath = path.join(__dirname, 'SectionA.json');
    
    fs.writeFile(filePath, JSON.stringify(rows, null, 2), (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
        return res.status(500).send('Error writing JSON file');
      }
      console.log('JSON file created successfully' , filePath);
      res.json(rows); // Send data as JSON response
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Database error: ' + err.message);
  }
});

app.post('/viewpapersectionB', async (req, res) => {
  const { section } = req.body;

  if (!section) {
    return res.status(400).send('Section is required');
  }

  try {
    const connection = await pool.getConnection();
    // Use the section parameter in the query
    const query = 'SELECT * FROM question WHERE Section = ?';
    const [rows] = await connection.execute(query, [section]);
    connection.release();

    const filePath = path.join(__dirname, 'SectionB.json');
    
    fs.writeFile(filePath, JSON.stringify(rows, null, 2), (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
        return res.status(500).send('Error writing JSON file');
      }
      console.log('JSON file created successfully' , filePath);
      res.json(rows); // Send data as JSON response
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Database error: ' + err.message);
  }
});



app.post('/Pending_request', async (req, res) => {
  const { Company_Id } = req.body;
  const query = "SELECT * FROM student WHERE Company_Id = ? AND status = 'pending'";
  
  let connection;

  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    const [results] = await connection.execute(query, [Company_Id]); 

    const studentCount = results.length;

    console.log("Number of pending students: " + studentCount);

    // Create JSON string with the pending students data
    const jsonString = JSON.stringify(results, null, 2);
    const filePath = 'pendingstudents.json';

    // Write JSON string to file
    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ message: 'Error writing file' });
      }
      console.log('JSON data has been saved to', filePath);
      res.json({ count: studentCount });
    });

  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send({ message: 'Error executing query' });
  } finally {
    if (connection) connection.release(); // Ensure connection is released
  }
});



app.post('/displayquestion', async (req, res) => {
  // Get Company_Id from the request body
  const { Company_Id } = req.body;

  if (!Company_Id) {
    return res.status(400).json({ message: 'Company_Id is required' });
  }

  const query = 'SELECT * FROM question WHERE Company_Id = ?';

  let connection;

  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(query, [Company_Id]);

    const jsonString = JSON.stringify(results, null, 2);
    const filePath = 'questionjson.json';

    // Use fs.writeFile to handle file writing asynchronously
    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ message: 'Error writing file' });
      }
      console.log('JSON data has been saved to', filePath);
      res.status(200).json({ message: 'JSON data has been saved successfully' }); // Send response after file is saved
    });

  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ message: 'Error executing query' });
  } finally {
    if (connection) connection.release(); // Ensure connection is released
  }
});






app.post('/submitAnswers', async (req, res) => {
  const {
    studentInfo: {
      Student_Name,
      Student_Id,
      Email_Id,
      Paper_Code,
      attemptedQuestions,
      correctAnswers,
      wrongAnswers,
      randomNumber
    },
    score
  } = req.body;
  try {
    const connection = await pool.getConnection();

    const insertQuery = `
      INSERT INTO answers (Student_Name, Student_Id, Email_Id, Total_Marks, Paper_Code, Attempt_questions, Right_Answer, Wrong_Answer, randomNumber)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const insertValues = [
      Student_Name,
      Student_Id,
      Email_Id,
      score,
      Paper_Code,
      JSON.stringify(attemptedQuestions),
      JSON.stringify(correctAnswers),
      JSON.stringify(wrongAnswers),
      randomNumber
    ];

    await connection.execute(insertQuery, insertValues);

    const selectQuery = 'SELECT * FROM answers WHERE randomNumber = ?';
    const [rows] = await connection.execute(selectQuery, [randomNumber]);

    // Save the results to a JSON file
    if (rows.length > 0) {
      const jsonString = JSON.stringify({ resultde: rows }, null, 2);
      const filePath = 'result.json';

      await new Promise((resolve, reject) => {
        fs.writeFile(filePath, jsonString, 'utf8', (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });

      console.log('JSON data has been saved to', filePath);
    }

    connection.release();

    res.json({ resultde: rows });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).send('Internal server error');
  }
});


app.post('/api/contantdownlode', async (req, res) => {
  const { Company_id } = req.body; // Updated to match the key from the frontend

  if (!Company_id) {
    return res.status(400).send('Company_id is required');
  }

  const connection = await pool.getConnection();
  try {
    const query = 'SELECT * FROM educational_content WHERE Company_Id = ?';
    const [rows] = await connection.execute(query, [Company_id]); // Using Company_id

    if (rows.length === 0) {
      return res.status(404).send('No academy found with the given Company_id');
    }

    const filePath = path.join(__dirname, 'contantvideo.json');

    fs.writeFile(filePath, JSON.stringify(rows, null, 2), (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
        return res.status(500).send('Error writing JSON file');
      }
      console.log(`JSON file created successfully at ${filePath}`);
      res.json(rows); // Send data as JSON response
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Database error: ' + err.message);
  } finally {
    connection.release();
  }
});




app.post('/update', async (req, res) => {
  const { studentIds } = req.body; // studentIds is an array of Student_Id values

  let connection;
  try {
    connection = await pool.getConnection();
    const studentDetails = [];

    // Use for...of loop to handle asynchronous operations correctly
    for (const studentId of studentIds) {
      const query = 'SELECT * FROM student WHERE Student_Id = ?';
      const [rows] = await connection.execute(query, [studentId]);
      
      if (rows.length > 0) {
        studentDetails.push(rows[0]); // Assuming you want to push the first row of results
      }
    }

    const jsonString = JSON.stringify(studentDetails, null, 2);
    const filePath = 'studentdetail.json';

    // Use a promise to handle the fs.writeFile operation
    await new Promise((resolve, reject) => {
      fs.writeFile(filePath, jsonString, 'utf8', (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    console.log('JSON data has been saved to', filePath);
    res.status(200).json({ message: 'Data processed successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error: ' + err.message });
  } finally {
    if (connection) connection.release(); // Ensure connection is released in both success and error cases
  }
});

app.post('/api/deleteProduct/:Company_Id/:Serial_Number', async (req, res) => {
  const companyId = req.params.Company_Id;
  const serialNumber = req.params.Serial_Number;

  let connection;

  try {
    connection = await pool.getConnection();

    const [result] = await connection.execute(
      'DELETE FROM question WHERE Company_Id = ? AND Serial_Number = ?',
      [companyId, serialNumber]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    if (connection) connection.release(); // Ensure connection is released
  }
});

app.post('/deletequestion', async (req, res) => {
  const { Company_Id: companyId } = req.body;

  let connection;

  try {
    connection = await pool.getConnection();

    const [result] = await connection.execute(
      'DELETE FROM question WHERE Company_Id = ?',
      [companyId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (err) {
    console.error('Error deleting question:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    if (connection) connection.release(); // Ensure connection is released
  }
});
////  Key Id Or Sec


app.post('/api/paypal', async (req, res) => {
  const { clientId, clientSecret, academyId } = req.body;

  try {
    const connection = await pool.getConnection();

    // Insert new credentials
    const insertQuery = `INSERT INTO paypal_credentials (client_id, client_secret, academy_id) VALUES (?, ?, ?)`;
    await connection.execute(insertQuery, [clientId, clientSecret, academyId]);

    // Select all existing credentials
    const selectQuery = `SELECT * FROM paypal_credentials`;
    const [rows] = await connection.query(selectQuery);

    connection.release();

    // Convert the result to JSON and write to file
    const jsonString = JSON.stringify(rows, null, 2);
    const filePath = 'paypal_Cod.json';

    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ message: 'Error writing file' });
      }
      console.log('JSON data has been saved to', filePath);
      res.status(200).json({ message: 'JSON data has been saved successfully' }); // Send response after file is saved
    });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});



app.post('/Academy_Payment', async (req, res) => {
  const { Company_Id } = req.body;

  let connection;
  try {
    connection = await pool.getConnection();
    const query = 'SELECT * FROM paypal_credentials WHERE academy_id = ?';
    const [rows] = await connection.execute(query, [Company_Id]);

    if (rows.length > 0) {
      const jsonString = JSON.stringify(rows);
      const filePath = 'paypal_Cod.json';

      fs.writeFile(filePath, jsonString, 'utf8', (err) => {
        if (err) {
          console.error('Error writing file:', err);
          res.status(500).json({ message: 'Error writing file' });
        } else {
          console.log('JSON data has been saved to', filePath);
          res.status(200).json({ message: 'Data retrieved and saved successfully' });
        }
      });
    } else {
      res.status(404).json({ message: 'No data found for the given clientId' });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error: ' + err });
  } finally {
    if (connection) connection.release(); // Ensure connection is released in both success and error cases
  }
});




// Set up storage for multer




// Route to handle file upload and metadata saving


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/api/upload-educational-content', upload.single('file'), async (req, res) => {
  const { title, description, companyId } = req.body;
  const filePath = req.file.path; // Path to the uploaded file

  console.log('Received request to upload educational content');
  console.log(`Title: ${title}`);
  console.log(`Description: ${description}`);
  console.log(`Company ID: ${companyId}`);
  console.log(`File path: ${filePath}`);

  try {
    const connection = await pool.getConnection();
    console.log('Connected to the database');

    const query = 'INSERT INTO educational_content (title, description, file_path, Company_Id) VALUES (?, ?, ?, ?)';
    const [result] = await connection.execute(query, [title, description, filePath, companyId]);

    console.log('Content inserted successfully');
    connection.release();

    res.status(200).send('Insert successfully');
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).send('Internal server error');
  }
});

app.post('/conform', async (req, res) => {
  try {
    const { a1, t6 } = req.body;

    if (!a1 || !t6) {
      return res.status(400).send('Missing required fields');
    }

    const connection = await pool.getConnection();

    // Update the student's status
    await connection.execute('UPDATE student SET status = ? WHERE Student_Id = ?', [a1, t6]);

    // Fetch the updated student details
    const [rows] = await connection.execute('SELECT * FROM student WHERE Student_Id = ?', [t6]);
    const student = rows[0];
    connection.release();
    console.log(student)

    // Send email if the status has changed
    if (student.status === a1) {
      const mailOptions = {
        from: `"Rishabh Gusain" <${process.env.EMAIL_USER}>`,
        to: student.Email_Id,
        subject: 'Your Status Has Been Updated',
        html: `
          <html>
            <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                <h2 style="color: #2c3e50; margin-bottom: 20px;">Status Update</h2>
                <p style="margin-bottom: 20px;">Dear ${student.Student_Name} ${student.Last_Name},</p>
                <p style="margin-bottom: 20px;">We wanted to inform you that your status has been updated.</p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <tr style="background-color: #ffffff; border: 1px solid #ddd;">
                    <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Current Status</th>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${student.status}</td>
                  </tr>
                  <tr style="background-color: #ffffff; border: 1px solid #ddd;">
                    <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Login ID</th>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${student.Student_Id}</td>
                  </tr>
                  <tr style="background-color: #ffffff; border: 1px solid #ddd;">
                    <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Password</th>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${student.Password}</td>
                  </tr>
                </table>
                <p style="margin-bottom: 20px;">If you have any questions or need further assistance, feel free to reply to this email.</p>
                <p style="margin-bottom: 10px;">Best regards,</p>
                <p style="margin-bottom: 10px;"><strong>Sand Box</strong></p>
                <p style="font-size: 14px; color: #777;">This is an automated message. Please do not reply directly to this email.</p>
              </div>
            </body>
          </html>`
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${student.Email_Id}`);
    }

    res.send('Profile updated successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});




/// Update Profile

app.post('/editprofilestudent', upload.single('profile_image'), async (req, res) => {
  try {
    const { t1, t2, t3, t4, t5, t6, t7, t8 } = req.body;
    const profileImage = req.file ? req.file.path : null; // Get the path of the uploaded file

    const connection = await pool.getConnection();
    const query = `UPDATE student SET Student_Name=?, Last_Name=?, Address=?, Phone_Number=?, Father_Name=?, Student_Id=?, Email_Id=?, file_path=? WHERE Password=?`;
    await connection.execute(query, [t1, t2, t3, t4, t5, t6, t7, profileImage, t8]);

    connection.release();

    res.send('Profile updated successfully');
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).send('Internal server error');
  }
});



app.post('/changestatus', async (req, res) => {
  try {
    const { academyId, status } = req.body;

    if (!academyId || !status) {
      return res.status(400).json({ message: 'Academy ID and status are required' });
    }

    // Get a connection from the pool
    const connection = await pool.getConnection();

    try {
      const query = 'UPDATE academy SET subscription_status = ? WHERE Company_Id = ?';
      const [result] = await connection.query(query, [status, academyId]);

      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Subscription status updated successfully' });
      } else {
        res.status(404).json({ message: 'Academy not found' });
      }
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).send('Internal server error');
  }
});



app.post('/api/posts', upload.single('t3'), async (req, res) => {
  const { t1, t2, t4 } = req.body;
  const t3 = req.file ? req.file.path : '';
  const date = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  console.log(date); // Log current date in YYYY-MM-DD format

  try {
    const connection = await pool.getConnection();

    // Insert the new post into the database
    const insertQuery = 'INSERT INTO posts (title, author, image, content, date) VALUES (?, ?, ?, ?, ?)';
    await connection.execute(insertQuery, [t1, t2, t3, t4, date]);

    // Retrieve all posts from the database
    const selectQuery = 'SELECT * FROM posts';
    const [rows] = await connection.execute(selectQuery);

    connection.release();

    // Format the date field if necessary
    const formattedPosts = rows.map(post => {
      let formattedDate;
      if (typeof post.date === 'string') {
        formattedDate = post.date.split('T')[0];
      } else if (post.date instanceof Date) {
        formattedDate = post.date.toISOString().split('T')[0];
      } else {
        // Handle other potential formats or types
        formattedDate = post.date; // or set a default value
      }

      return {
        ...post,
        date: formattedDate
      };
    });

    // Save the result to a JSON file
    const filePath = path.join(__dirname, 'posts.json');
    fs.writeFileSync(filePath, JSON.stringify(formattedPosts, null, 2), 'utf8');

    res.status(201).json({
      message: 'Post saved successfully!',
      posts: formattedPosts  // Return all posts with formatted date
    });

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
