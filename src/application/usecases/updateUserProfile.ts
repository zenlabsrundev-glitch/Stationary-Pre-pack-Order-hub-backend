import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../domain/user';

export class UpdateUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, updates: Partial<User>): Promise<User> {
    return this.userRepository.update(id, updates);
  }
}
