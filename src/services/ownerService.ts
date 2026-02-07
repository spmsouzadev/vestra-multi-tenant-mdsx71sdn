import { supabase } from '@/lib/supabase/client'
import { Owner } from '@/types'

export const ownerService = {
  async getOwners(): Promise<Owner[]> {
    const { data, error } = await supabase
      .from('owners')
      .select('*')
      .order('name')

    if (error) throw error

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone || '',
      document: row.document || '',
      unitsOwned: [], // Populating this would require a join or separate query
    }))
  },

  async createOwner(owner: Omit<Owner, 'id' | 'unitsOwned'>): Promise<Owner> {
    const { data, error } = await supabase
      .from('owners')
      .insert({
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        document: owner.document,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      document: data.document || '',
      unitsOwned: [],
    }
  },
}
