import { IUserRepository } from '../interfaces/IUserRepository';
import { EmailService } from '../../infrastructure/emailService';

// Temporary in-memory store for OTPs (In production, use Redis or DB)
export const otpStore = new Map<string, { otp: string, expiresAt: number }>();

export class SendOtpUseCase {
  constructor(private userRepository: IUserRepository, private emailService: EmailService) {}

  async execute(email: string, type: 'registration' | 'forgotPassword' = 'forgotPassword'): Promise<boolean> {
    // For forgot password — user must exist first
    if (type === 'forgotPassword') {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error('No account found with this email address.');
      }
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with 10 min expiration
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    try {
      await this.emailService.sendVerificationEmail(email, otp);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
