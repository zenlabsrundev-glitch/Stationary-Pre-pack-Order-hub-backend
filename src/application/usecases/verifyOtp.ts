import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../domain/user';
import { otpStore } from './sendOtp';
import jwt from 'jsonwebtoken';

import { ENV } from '../../config/env';

export class VerifyOtpUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, otp: string): Promise<{ user?: User, token?: string, verified: boolean }> {
    const stored = otpStore.get(email);
    
    if (!stored) {
      throw new Error('No OTP requested for this email');
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      throw new Error('OTP has expired');
    }

    if (stored.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    // OTP matches, delete it
    otpStore.delete(email);

    // Try to find user — may not exist yet (registration flow)
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      const secret = ENV.JWT_SECRET;
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: '7d' }
      );
      return { user, token, verified: true };
    }

    // Registration flow — user not in DB yet, just confirm OTP verified
    return { verified: true };
  }
}
