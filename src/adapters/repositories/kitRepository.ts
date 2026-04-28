import { IKitRepository } from '../../application/interfaces/IKitRepository';
import { Kit } from '../../application/domain/kit';
import { supabase } from '../../infrastructure/supabaseClient';

export class KitRepository implements IKitRepository {
  async findAll(): Promise<Kit[]> {
    const { data, error } = await supabase.from('kits').select('*');
    if (error) throw new Error(error.message);
    return data as Kit[];
  }

  async findById(id: string): Promise<Kit | null> {
    const { data, error } = await supabase.from('kits').select('*').eq('id', id).single();
    if (error || !data) return null;
    return data as Kit;
  }

  async create(kit: Partial<Kit>): Promise<Kit> {
    const { data, error } = await supabase.from('kits').insert([kit]).select().single();
    if (error) throw new Error(error.message);
    return data as Kit;
  }

  async update(id: string, kit: Partial<Kit>): Promise<Kit> {
    const { data, error } = await supabase.from('kits').update(kit).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data as Kit;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('kits').delete().eq('id', id);
    if (error) return false;
    return true;
  }
}
