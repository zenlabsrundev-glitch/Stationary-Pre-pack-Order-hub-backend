import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../domain/user';

export class GetAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
