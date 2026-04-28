import { Request, Response } from 'express';
import { GetKitsUseCase } from '../../application/usecases/getKits';

export class KitController {
  constructor(private getKitsUseCase: GetKitsUseCase) {}

  async getAllKits(req: Request, res: Response) {
    try {
      const kits = await this.getKitsUseCase.execute();
      return res.json(kits);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getKitById(req: Request, res: Response, getKitByIdUseCase: any) {
    try {
      const kit = await getKitByIdUseCase.execute(req.params.id);
      if (!kit) return res.status(404).json({ message: 'Kit not found' });
      return res.json(kit);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async createKit(req: Request, res: Response, createKitUseCase: any) {
    try {
      const kit = await createKitUseCase.execute(req.body);
      return res.status(201).json(kit);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateKit(req: Request, res: Response, updateKitUseCase: any) {
    try {
      const kit = await updateKitUseCase.execute(req.params.id, req.body);
      return res.json(kit);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteKit(req: Request, res: Response, deleteKitUseCase: any) {
    try {
      const success = await deleteKitUseCase.execute(req.params.id);
      if (!success) return res.status(404).json({ message: 'Kit not found' });
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
