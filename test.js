import { createTransport, getTestMessageUrl } from 'nodemailer';
import { authenticator } from 'otplib';

// Generate a new OTP
const otp = authenticator.generate('secret-key');
const currentDateTime = new Date().toLocaleString();

// Create a transporter
let transporter = createTransport({
  service: 'gmail',
  auth: {
    user: 'rishabhgusain51@gmail.com', // Replace with your Gmail address
    pass: 'uozs pcjw bzbz krbb'     // Replace with your Gmail app password
  }
});

// Set up email data
let mailOptions = {
  from: '"Rishabh Gusain" <rishabhgusain51@gmail.com>', // sender address
  to: 'rishabhgusain51@gmail.com',// list of receivers
  subject: 'Your OTP Code', // Subject line
  text: `Your OTP code is: ${otp}`, // plain text body
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
` // html body
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', getTestMessageUrl(info));
  console.log('Otp is '+otp)
  console.log('Time is '+currentDateTime)

});
