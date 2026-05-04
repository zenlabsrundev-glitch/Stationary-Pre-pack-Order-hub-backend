import { Request, Response } from 'express';
import { LoginUseCase } from '../../application/usecases/login';

export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  async login(req: any, res: any) {
    const { identifier, email, password, requiredRole } = req.body;
    try {
      const result = await this.loginUseCase.execute(identifier || email, password, requiredRole);
      
      if (!result) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      return res.json(result);
    } catch (error: any) {
      return res.status(403).json({ message: error.message });
    }
  }

  async register(req: any, res: any, registerUseCase: any) {
    try {
      const userData = req.body;
      const result = await registerUseCase.execute(userData);
      
      if (typeof result === 'string') {
        return res.status(400).json({ message: result });
      }
      
      return res.status(201).json(result);
    } catch (error: any) {
      console.error('Registration Error:', error);
      return res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }

  async sendOtp(req: any, res: any, sendOtpUseCase: any) {
    const { email, type } = req.body;
    try {
      const success = await sendOtpUseCase.execute(email, type || 'forgotPassword');
      if (success) {
        return res.json({ message: 'OTP sent successfully' });
      }
      return res.status(500).json({ message: 'Failed to send OTP' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async verifyOtp(req: any, res: any, verifyOtpUseCase: any) {
    const { email, otp } = req.body;
    try {
      const result = await verifyOtpUseCase.execute(email, otp);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async resetPassword(req: any, res: any, resetPasswordUseCase: any) {
    const { email, newPassword } = req.body;
    try {
      await resetPasswordUseCase.execute(email, newPassword);
      return res.json({ message: 'Password updated successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async recoverCredentials(req: any, res: any, userRepository: any, emailService: any) {
    const { email, userId } = req.body;
    try {
      let user;
      if (userId) {
        user = await userRepository.findById(userId);
      } else {
        user = await userRepository.findByEmail(email);
      }

      if (!user) {
        return res.status(404).json({ message: 'Account not found' });
      }
      
      // Send the beautiful HTML credentials email
      await emailService.sendCredentialsEmail(
        email || user.email,
        user.identifier || user.id,
        user.password
      );
      
      return res.json({ message: 'Credentials sent successfully' });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
