import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../domain/user';
import jwt from 'jsonwebtoken';

import { ENV } from '../../config/env';

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(identifier: string, password: string, requiredRole?: string): Promise<{ user: User, token: string } | null> {
    // Try to find by email first, then by id
    let user = await this.userRepository.findByEmail(identifier);
    if (!user) {
      user = await this.userRepository.findById(identifier);
    }

    if (!user || user.password !== password) {
      return null;
    }

    // Role-based login enforcement
    if (requiredRole && user.role.toLowerCase() !== requiredRole.toLowerCase()) {
      throw new Error(`This account does not have ${requiredRole} access.`);
    }

    const secret = ENV.JWT_SECRET;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as User, token };
  }
}
