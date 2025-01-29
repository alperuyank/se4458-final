const nodemailer = require('nodemailer');

// E-posta gönderme fonksiyonu
const sendEmail = async (to, subject, body) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'alperuyanikse4458@gmail.com',
      pass: 'Test1234T',
    },
  });

  const mailOptions = {
    from: 'alperuyanikse4458@gmail.com',
    to,
    subject,
    text: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
