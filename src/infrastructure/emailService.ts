import nodemailer from 'nodemailer';

export interface EmailService {
  sendVerificationEmail(to: string, otp: string): Promise<void>;
}

export class NodemailerEmailService implements EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use Gmail App Password here
      },
    });
  }

  async sendVerificationEmail(to: string, otp: string): Promise<void> {
    const mailOptions = {
      from: `"Stationery Hub" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Email Verification - Stationery Hub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
          <p>Thank you for signing up with <strong>Stationery Hub</strong>. Please use the following OTP to verify your email address:</p>
          <div style="font-size: 24px; font-weight: bold; text-align: center; padding: 20px; background: #f4f4f4; border-radius: 5px; color: #007bff; letter-spacing: 5px;">
            ${otp}
          </div>
          <p style="margin-top: 20px;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 Stationery Hub. All rights reserved.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Could not send verification email');
    }
  }
}
