import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

export interface EmailService {
  sendVerificationEmail(to: string, otp: string): Promise<void>;
  sendCredentialsEmail(to: string, userId: string, password: string): Promise<void>;
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}

export class NodemailerEmailService implements EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: ENV.EMAIL.HOST || 'smtp.gmail.com',
      port: ENV.EMAIL.PORT,
      secure: ENV.EMAIL.PORT === 465,
      auth: {
        user: ENV.EMAIL.USER,
        pass: ENV.EMAIL.PASS,
      },
    });
  }

  private isPlaceholder(): boolean {
    return !ENV.EMAIL.USER || 
           ENV.EMAIL.USER === 'your-email@gmail.com' || 
           !ENV.EMAIL.PASS ||
           ENV.EMAIL.PASS === 'your-app-password';
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    if (this.isPlaceholder()) {
      console.log('\x1b[33m%s\x1b[0m', '--- [MOCK EMAIL] ---');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${body}`);
      console.log('\x1b[33m%s\x1b[0m', '--------------------');
      return;
    }

    const mailOptions = {
      from: `"Campus Kit Hub" <${ENV.EMAIL.USER}>`,
      to,
      subject: `✨ ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background: #4f46e5; padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0; font-size: 18px;">Campus Kit Hub</h2>
          </div>
          <div style="padding: 30px; color: #374151; line-height: 1.6;">
            ${body.replace(/\n/g, '<br>')}
          </div>
          <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 11px; color: #9ca3af;">
            &copy; 2026 Campus Kit Hub
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      console.warn('Falling back to console logging...');
      console.log(`[FALLBACK] To: ${to}, Subject: ${subject}, Body: ${body}`);
    }
  }

  async sendVerificationEmail(to: string, otp: string): Promise<void> {
    if (this.isPlaceholder()) {
      console.log('\x1b[33m%s\x1b[0m', '--- [MOCK VERIFICATION EMAIL] ---');
      console.log(`To: ${to}`);
      console.log(`OTP: ${otp}`);
      console.log('\x1b[33m%s\x1b[0m', '-------------------------------');
      return;
    }

    const mailOptions = {
      from: `"Stationery Hub" <${ENV.EMAIL.USER}>`,
      to,
      subject: '🛡️ Verify Your Email - Stationery Hub',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: auto; padding: 0; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Verification Code</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px; background: #ffffff; text-align: center;">
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Thank you for signing up. Please use the verification code below to confirm your email address:
            </p>
            
            <div style="background: #f3f4f6; border-radius: 8px; padding: 25px; margin: 20px 0; display: inline-block;">
              <span style="color: #4f46e5; font-size: 32px; font-weight: 800; letter-spacing: 8px; font-family: monospace;">${otp}</span>
            </div>

            <p style="color: #9ca3af; font-size: 13px; margin-top: 25px;">
              This code is valid for <strong>10 minutes</strong>.<br>
              If you did not request this, please ignore this email.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280; margin: 0;">&copy; 2026 Stationery Hub. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      console.warn('Falling back to console logging...');
      console.log(`[FALLBACK] Verification OTP for ${to}: ${otp}`);
    }
  }

  async sendCredentialsEmail(to: string, userId: string, password: string): Promise<void> {
    if (this.isPlaceholder()) {
      console.log('\x1b[33m%s\x1b[0m', '--- [MOCK CREDENTIALS EMAIL] ---');
      console.log(`To: ${to}`);
      console.log(`User ID: ${userId}`);
      console.log(`Password: ${password}`);
      console.log('\x1b[33m%s\x1b[0m', '-------------------------------');
      return;
    }

    const mailOptions = {
      from: `"Campus Kit Hub" <${ENV.EMAIL.USER}>`,
      to,
      subject: '✨ Welcome to Campus Kit Hub - Your Account is Ready!',
      html: `
        <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 550px; margin: auto; padding: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(79, 70, 229, 0.15); border: 1px solid #e5e7eb;">
          <!-- Vibrant Gradient Header -->
          <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); padding: 40px 20px; text-align: center;">
            <div style="background: rgba(255, 255, 255, 0.2); width: 60px; height: 60px; border-radius: 12px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 30px;">🎓</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Campus Kit Hub</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin-top: 5px; font-size: 14px;">Your academic journey starts here</p>
          </div>
          
          <!-- Content Body -->
          <div style="padding: 40px; background: #ffffff;">
            <h2 style="color: #111827; font-size: 20px; margin-top: 0; margin-bottom: 15px;">Hello there! 👋</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Your account has been successfully created. We've generated secure credentials for you to access the portal.
            </p>
            
            <!-- Credentials Card -->
            <div style="background: #f8fafc; border: 2px solid #f1f5f9; border-radius: 12px; padding: 25px; margin-bottom: 30px; position: relative;">
              <div style="margin-bottom: 20px;">
                <label style="display: block; color: #6366f1; font-size: 11px; text-transform: uppercase; font-weight: 700; margin-bottom: 6px; letter-spacing: 1px;">User ID / Identifier</label>
                <div style="color: #1e293b; font-size: 20px; font-family: 'Courier New', Courier, monospace; font-weight: 700; background: #ffffff; padding: 10px 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
                  ${userId}
                </div>
              </div>
              <div>
                <label style="display: block; color: #ec4899; font-size: 11px; text-transform: uppercase; font-weight: 700; margin-bottom: 6px; letter-spacing: 1px;">Temporary Password</label>
                <div style="color: #1e293b; font-size: 20px; font-family: 'Courier New', Courier, monospace; font-weight: 700; background: #ffffff; padding: 10px 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
                  ${password}
                </div>
              </div>
            </div>

            <!-- Vibrant Action Button -->
            <div style="text-align: center; margin-top: 10px;">
              <a href="https://campush-kit-hub.web.app/login" style="background: linear-gradient(to right, #6366f1, #4f46e5); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3); display: inline-block;">
                Login to Your Dashboard
              </a>
            </div>

            <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-top: 35px; line-height: 1.5;">
              Safety first! Please update your password immediately after logging in for the first time.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #f1f5f9;">
            <div style="margin-bottom: 15px;">
              <span style="color: #cbd5e1; font-size: 20px;">📦 ✨ 🎓</span>
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; 2026 Campus Kit Hub. All rights reserved.</p>
            <p style="font-size: 11px; color: #cbd5e1; margin-top: 5px;">Made with ❤️ for students</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Credentials email sent to ${to}`);
    } catch (error) {
      console.error('Error sending credentials email:', error);
      console.warn('Falling back to console logging...');
      console.log(`[FALLBACK] Credentials for ${to} -> User ID: ${userId}, Password: ${password}`);
    }
  }
}

