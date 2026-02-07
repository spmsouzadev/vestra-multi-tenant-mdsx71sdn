import { supabase } from '@/lib/supabase/client'
import { Unit } from '@/types'

// Helper to map DB row to App type
const mapToUnit = (row: any): Unit => ({
  id: row.id,
  projectId: row.project_id,
  block: row.block,
  number: row.number,
  floor: row.floor,
  bedrooms: row.bedrooms || 0,
  bathrooms: row.bathrooms || 0,
  typology: row.typology || '',
  area: row.area || 0,
  price: row.price || 0,
  status: row.status as Unit['status'],
  ownerId: row.owner_id || undefined,
})

export const unitService = {
  async getUnits(projectId: string): Promise<Unit[]> {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('project_id', projectId)
      .order('block', { ascending: true })
      .order('number', { ascending: true })

    if (error) throw error
    return data.map(mapToUnit)
  },

  async createUnit(unit: Omit<Unit, 'id' | 'ownerId'>): Promise<Unit> {
    const dbUnit = {
      project_id: unit.projectId,
      block: unit.block,
      number: unit.number,
      floor: unit.floor,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      typology: unit.typology,
      area: unit.area,
      price: unit.price,
      status: unit.status,
    }

    const { data, error } = await supabase
      .from('units')
      .insert(dbUnit)
      .select()
      .single()

    if (error) throw error
    return mapToUnit(data)
  },

  async updateUnit(unit: Unit): Promise<Unit> {
    const dbUnit = {
      block: unit.block,
      number: unit.number,
      floor: unit.floor,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      typology: unit.typology,
      area: unit.area,
      price: unit.price,
      status: unit.status,
      owner_id: unit.ownerId || null,
    }

    const { data, error } = await supabase
      .from('units')
      .update(dbUnit)
      .eq('id', unit.id)
      .select()
      .single()

    if (error) throw error
    return mapToUnit(data)
  },

  async deleteUnit(id: string): Promise<void> {
    const { error } = await supabase.from('units').delete().eq('id', id)

    if (error) throw error
  },
}
