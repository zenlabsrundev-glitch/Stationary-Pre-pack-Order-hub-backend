import { IKitRepository } from '../interfaces/IKitRepository';
import { Kit } from '../domain/kit';

export class UpdateKitUseCase {
  constructor(private kitRepository: IKitRepository) {}

  async execute(id: string, kitData: Partial<Kit>): Promise<Kit> {
    return this.kitRepository.update(id, kitData);
  }
}
