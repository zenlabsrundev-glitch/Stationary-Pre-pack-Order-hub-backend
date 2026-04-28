export type Role = 'student' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  role: Role;
  department?: string;
  year?: string;
  dateOfBirth?: string;
  address?: string;
  phoneNumber?: string;
  location?: { lat: number; lng: number };
  createdAt: string;
}
