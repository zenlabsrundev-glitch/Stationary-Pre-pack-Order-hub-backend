import { IUserRepository } from '../interfaces/IUserRepository';

export class ResetPasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, newPassword: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    
    await this.userRepository.update(user.id, { password: newPassword });
    return true;
  }
}
