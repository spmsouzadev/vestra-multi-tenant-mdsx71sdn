import { supabase } from '@/lib/supabase/client'
import { WarrantyCategory, UnitWarranty } from '@/types'
import { addYears, format } from 'date-fns'

export const warrantyService = {
  // Categories
  async getCategories(tenantId: string): Promise<WarrantyCategory[]> {
    const { data, error } = await supabase
      .from('warranty_categories')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('name')

    if (error) throw error

    return data.map((row: any) => ({
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      termYears: row.term_years,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
  },

  async createCategory(
    category: Omit<WarrantyCategory, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<WarrantyCategory> {
    const { data, error } = await supabase
      .from('warranty_categories')
      .insert({
        tenant_id: category.tenantId,
        name: category.name,
        term_years: category.termYears,
        description: category.description,
      })
      .select()
      .single()

    if (error) throw error
    return {
      id: data.id,
      tenantId: data.tenant_id,
      name: data.name,
      termYears: data.term_years,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  },

  async updateCategory(
    id: string,
    updates: Partial<WarrantyCategory>,
  ): Promise<void> {
    const dbUpdates: any = {}
    if (updates.name) dbUpdates.name = updates.name
    if (updates.termYears) dbUpdates.term_years = updates.termYears
    if (updates.description) dbUpdates.description = updates.description
    dbUpdates.updated_at = new Date().toISOString()

    const { error } = await supabase
      .from('warranty_categories')
      .update(dbUpdates)
      .eq('id', id)

    if (error) throw error
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('warranty_categories')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Unit Warranties
  async getUnitWarranties(unitId: string): Promise<UnitWarranty[]> {
    const { data, error } = await supabase
      .from('unit_warranties')
      .select(
        `
        *,
        warranty_categories (
          name
        )
      `,
      )
      .eq('unit_id', unitId)

    if (error) throw error

    return data.map((row: any) => ({
      id: row.id,
      unitId: row.unit_id,
      categoryId: row.category_id,
      startDate: row.start_date,
      expirationDate: row.expiration_date,
      status: row.status,
      notes: row.notes,
      categoryName: row.warranty_categories?.name,
      createdAt: row.created_at,
    }))
  },

  async getProjectWarranties(
    projectUnitIds: string[],
  ): Promise<UnitWarranty[]> {
    if (projectUnitIds.length === 0) return []

    const { data, error } = await supabase
      .from('unit_warranties')
      .select(
        `
        *,
        warranty_categories (
          name
        )
      `,
      )
      .in('unit_id', projectUnitIds)

    if (error) throw error

    return data.map((row: any) => ({
      id: row.id,
      unitId: row.unit_id,
      categoryId: row.category_id,
      startDate: row.start_date,
      expirationDate: row.expiration_date,
      status: row.status,
      notes: row.notes,
      categoryName: row.warranty_categories?.name,
      createdAt: row.created_at,
    }))
  },

  async generateWarranties(
    unitId: string,
    startDate: Date,
    tenantId: string,
  ): Promise<void> {
    // 1. Get Categories
    const categories = await this.getCategories(tenantId)

    // 2. Prepare Inserts
    const inserts = categories.map((cat) => ({
      unit_id: unitId,
      category_id: cat.id,
      start_date: format(startDate, 'yyyy-MM-dd'),
      expiration_date: format(addYears(startDate, cat.termYears), 'yyyy-MM-dd'),
      status: 'Vigente',
      notes: `Gerado automaticamente em ${new Date().toLocaleDateString()}`,
    }))

    if (inserts.length === 0) return

    // 3. Delete existing (optional, or avoid duplicates)
    // For simplicity, we assume this is "Configure" action, so we wipe previous non-custom ones or just add.
    // Let's wipe previous for this unit to ensure clean state if re-configuring.
    await supabase.from('unit_warranties').delete().eq('unit_id', unitId)

    // 4. Insert
    const { error } = await supabase.from('unit_warranties').insert(inserts)
    if (error) throw error
  },

  async updateUnitWarrantyStatus(
    id: string,
    status: string,
    notes?: string,
  ): Promise<void> {
    const updates: any = { status, updated_at: new Date().toISOString() }
    if (notes !== undefined) updates.notes = notes

    const { error } = await supabase
      .from('unit_warranties')
      .update(updates)
      .eq('id', id)

    if (error) throw error
  },
}
