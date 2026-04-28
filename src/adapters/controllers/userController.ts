import { Request, Response } from 'express';

export class UserController {
  constructor(
    private getUserProfileUseCase: any,
    private updateUserProfileUseCase: any,
    private getAllUsersUseCase: any,
    private deleteUserUseCase: any
  ) {}

  async getAllUsers(req: any, res: any) {
    try {
      const users = await this.getAllUsersUseCase.execute();
      return res.json(users);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteUser(req: any, res: any) {
    const { id } = req.params;
    try {
      const success = await this.deleteUserUseCase.execute(id);
      if (!success) return res.status(404).json({ message: 'User not found' });
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getProfile(req: any, res: any) {
    const { id } = req.params;
    try {
      const user = await this.getUserProfileUseCase.execute(id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateProfile(req: any, res: any) {
    const { id } = req.params;
    const updates = req.body;
    try {
      const updatedUser = await this.updateUserProfileUseCase.execute(id, updates);
      return res.json(updatedUser);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
