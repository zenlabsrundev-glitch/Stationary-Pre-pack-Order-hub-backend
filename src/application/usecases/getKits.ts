import { IKitRepository } from '../interfaces/IKitRepository';
import { Kit } from '../domain/kit';

export class GetKitsUseCase {
  constructor(private kitRepository: IKitRepository) {}

  async execute(): Promise<Kit[]> {
    return this.kitRepository.findAll();
  }
}
