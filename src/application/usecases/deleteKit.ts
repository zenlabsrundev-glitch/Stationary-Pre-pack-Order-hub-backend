import { IKitRepository } from '../interfaces/IKitRepository';

export class DeleteKitUseCase {
  constructor(private kitRepository: IKitRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.kitRepository.delete(id);
  }
}

export class GetKitByIdUseCase {
  constructor(private kitRepository: IKitRepository) {}

  async execute(id: string) {
    return this.kitRepository.findById(id);
  }
}
