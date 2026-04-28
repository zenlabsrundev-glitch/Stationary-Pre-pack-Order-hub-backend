import { IUserRepository } from '../interfaces/IUserRepository';

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
