import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../domain/user';

export class GetUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}
