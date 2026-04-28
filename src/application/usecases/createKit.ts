import { IKitRepository } from '../interfaces/IKitRepository';
import { Kit } from '../domain/kit';

export class CreateKitUseCase {
  constructor(private kitRepository: IKitRepository) {}

  async execute(kitData: Partial<Kit>): Promise<Kit> {
    return this.kitRepository.create(kitData);
  }
}
