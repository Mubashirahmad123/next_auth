import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';

interface SendEmailOptions {
  email: string;
  emailType: 'VERIFY' | 'RESET';
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailOptions) => {
  try {
    // Hash the userId to create a token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // Update the user's document with the appropriate token and expiry time
    const updateData = emailType === 'VERIFY'
      ? { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 } // 1 hour from now
      : { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 };

    await User.findByIdAndUpdate(userId, updateData);

    // Create a transporter object using Mailtrap's SMTP server details
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "b23f272b9702a7",
        pass: "2f277490494a71",
      },
    });

    // Define the email options with the appropriate HTML content
    const mailOptions = {
      from: 'daniaal@gmail.com', // Sender address   
      to: email, // Recipient address
      subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
      html: emailType === 'VERIFY' ? getVerifyEmailHTML(hashedToken) : getResetPasswordEmailHTML(hashedToken),
    };

    // Send the email
    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;

  } catch (error: any) {
    throw new Error(error.message);
  }
};

// HTML template for the verification email
const getVerifyEmailHTML = (token: string) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Verify Your Email</h2>
      <p>Thank you for registering. Please click the link below to verify your email address:</p>
      <a href="${process.env.DOMAIN}/verifyemail?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none;">Verify Email</a>
      <p>If you did not create an account, please ignore this email.</p>
      <p>Alternatively, you can copy and paste the following link in your browser:</p>
      <p>${process.env.DOMAIN}/verifyemail?token=${token}</p>
    </div>
  `;
};

// HTML template for the reset password email
const getResetPasswordEmailHTML = (token: string) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Reset Your Password</h2>
      <p>We received a request to reset your password. Please click the link below to reset your password:</p>
      <a href="${process.env.DOMAIN}/resetpassword?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none;">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Alternatively, you can copy and paste the following link in your browser:</p>
      <p>${process.env.DOMAIN}/resetpassword?token=${token}</p>
    </div>
  `;
};




