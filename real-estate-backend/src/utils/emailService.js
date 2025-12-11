const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Email - RealEstate Pro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email Address</h2>
        <p>Hello ${data.name},</p>
        <p>Thank you for registering with RealEstate Pro. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all;">${data.verificationUrl}</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <br>
        <p>Best regards,<br>The RealEstate Pro Team</p>
      </div>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Password Reset Request - RealEstate Pro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Hello ${data.name},</p>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all;">${data.resetUrl}</p>
        <p>This link will expire in ${data.expiry}.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <br>
        <p>Best regards,<br>The RealEstate Pro Team</p>
      </div>
    `
  }),

  passwordChanged: (data) => ({
    subject: 'Password Changed Successfully - RealEstate Pro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Changed</h2>
        <p>Hello ${data.name},</p>
        <p>Your password was successfully changed on ${data.timestamp}.</p>
        <p>If you didn't make this change, please contact our support team immediately.</p>
        <br>
        <p>Best regards,<br>The RealEstate Pro Team</p>
      </div>
    `
  }),

  newInquiry: (data) => ({
    subject: 'New Property Inquiry - RealEstate Pro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Property Inquiry</h2>
        <p>Hello ${data.agentName},</p>
        <p>You have received a new inquiry for your property: <strong>${data.propertyTitle}</strong></p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0;">
          <p><strong>From:</strong> ${data.userName}</p>
          <p><strong>Email:</strong> ${data.userEmail}</p>
          <p><strong>Phone:</strong> ${data.userPhone || 'Not provided'}</p>
          <p><strong>Message:</strong> ${data.message}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.inquiryUrl}" 
             style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Inquiry
          </a>
        </div>
        <br>
        <p>Best regards,<br>The RealEstate Pro Team</p>
      </div>
    `
  }),

  propertyApproved: (data) => ({
    subject: 'Property Approved - RealEstate Pro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Property Approved</h2>
        <p>Hello ${data.agentName},</p>
        <p>Great news! Your property "<strong>${data.propertyTitle}</strong>" has been approved and is now live on our platform.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.propertyUrl}" 
             style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Property
          </a>
        </div>
        <p>Your property is now visible to potential buyers and renters.</p>
        <br>
        <p>Best regards,<br>The RealEstate Pro Team</p>
      </div>
    `
  }),

  propertyRejected: (data) => ({
    subject: 'Property Not Approved - RealEstate Pro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Property Not Approved</h2>
        <p>Hello ${data.agentName},</p>
        <p>We regret to inform you that your property "<strong>${data.propertyTitle}</strong>" was not approved.</p>
        <p><strong>Reason:</strong> ${data.reason}</p>
        <p>Please review the property details and make the necessary changes before resubmitting.</p>
        <br>
        <p>Best regards,<br>The RealEstate Pro Team</p>
      </div>
    `
  })
};

// Main send email function
const sendEmail = async (options) => {
  try {
    // If email is disabled in development, log instead of sending
    if (process.env.NODE_ENV === 'development' && process.env.DISABLE_EMAIL === 'true') {
      console.log('Email disabled in development. Would have sent:');
      console.log('To:', options.email);
      console.log('Subject:', options.subject);
      console.log('Template:', options.template);
      return { success: true, message: 'Email logged (disabled in development)' };
    }

    const transporter = createTransporter();
    
    // Get template
    const template = emailTemplates[options.template];
    if (!template) {
      throw new Error(`Email template '${options.template}' not found`);
    }

    const emailContent = template(options.data);

    const mailOptions = {
      from: `"RealEstate Pro" <${process.env.SMTP_USER}>`,
      to: options.email,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is correct');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

module.exports = {
  sendEmail,
  testEmailConfig,
  emailTemplates
};