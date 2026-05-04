import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../domain/user';
import { EmailService } from '../../infrastructure/emailService';

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private emailService: EmailService
  ) {}

  async execute(userData: Partial<User>): Promise<User | string> {
    const existing = await this.userRepository.findByEmail(userData.email!);
    if (existing) {
      return 'User already exists';
    }

    // 1. Generate User ID (fullName + last 4 digits of DOB + 4 random chars)
    const namePart = (userData.fullName || 'user').toLowerCase().replace(/[^a-z]/g, '').slice(0, 8);
    
    // Extract last 4 digits of DOB (usually MMDD)
    const dobPart = (userData.dateOfBirth || '').replace(/[^0-9]/g, '');
    const dobSuffix = dobPart.length >= 4 ? dobPart.slice(-4) : '0000';
    
    // User ID is exactly nameHalf + DOB Suffix
    const generatedUserId = `${namePart}_${dobSuffix}`;

    // 2. Generate Random Password
    const generatedPassword = Math.random().toString(36).slice(-8);

    // 3. Prepare User Data
    const newUser: Partial<User> = {
      ...userData,
      id: generatedUserId,
      password: generatedPassword, // In production, this should be hashed
      role: 'student', // Default role for registration
    };

    // 4. Create User in Database
    const createdUser = await this.userRepository.create(newUser);

    // 5. Send Credentials Email
    try {
      console.log(`[AUTH] Sending registration email to: ${createdUser.email}`);
      await this.emailService.sendCredentialsEmail(
        createdUser.email,
        generatedUserId,
        generatedPassword
      );
      console.log(`[AUTH] Registration email sent successfully to: ${createdUser.email}`);
    } catch (emailError) {
      console.error(`[AUTH] Failed to send registration email to ${createdUser.email}:`, emailError);
      // We don't throw here so the user is still created, but we know it failed.
    }

    return createdUser;
  }
}

