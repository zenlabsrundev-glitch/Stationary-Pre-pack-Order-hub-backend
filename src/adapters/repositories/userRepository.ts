import { IUserRepository } from '../../application/interfaces/IUserRepository';
import { User } from '../../application/domain/user';
import { supabase } from '../../infrastructure/supabaseClient';

export class UserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw new Error(error.message);
    return data as User[];
  }

  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error || !data) return null;
    return data as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error || !data) return null;
    return data as User;
  }

  async create(user: Partial<User>): Promise<User> {
    // Only extract fields that exist in the Supabase users table
    const { id, fullName, email, password, role, dateOfBirth, department, address, phoneNumber } = user;
    
    const newUser = {
      id: id || `USR-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fullName,
      email,
      password,
      role: role || 'student',
      dateOfBirth,
      department,
      address,
      phoneNumber,
      createdAt: new Date().toISOString()
    };

    const { data, error } = await supabase.from('users').insert([newUser]).select().single();
    
    if (error) {
      // RLS might block the SELECT after INSERT — verify the row actually exists
      if (error.code === 'PGRST116' || error.message.includes('0 rows')) {
        const { data: verify } = await supabase.from('users').select('id').eq('id', newUser.id).single();
        if (verify) {
          return newUser as User;
        }
        console.error('INSERT blocked by RLS — user was NOT created:', error);
        throw new Error('Registration failed: Database security policies blocked the operation. Please contact admin.');
      }
      console.error('Supabase Insert Error:', error);
      throw new Error(error.message);
    }
    return data as User;
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const { data, error } = await supabase.from('users').update(user).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data as User;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) return false;
    return true;
  }
}
