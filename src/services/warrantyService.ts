import { supabase } from '@/lib/supabase/client'
import { WarrantyCategory, UnitWarranty } from '@/types'
import { addMonths, format } from 'date-fns'

interface WarrantyAssignment {
  categoryId: string
  startDate: Date
}

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
      termMonths: row.term_months,
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
        term_months: category.termMonths,
        description: category.description,
      })
      .select()
      .single()

    if (error) throw error
    return {
      id: data.id,
      tenantId: data.tenant_id,
      name: data.name,
      termMonths: data.term_months,
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
    if (updates.termMonths !== undefined)
      dbUpdates.term_months = updates.termMonths
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

    // Supabase "in" filter has a limit, typically, but for this scale it should be fine.
    // For very large projects, batching might be needed.
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
    unitIds: string[],
    assignments: WarrantyAssignment[],
    tenantId: string,
  ): Promise<void> {
    if (unitIds.length === 0 || assignments.length === 0) return

    // 1. Get Categories to look up terms
    const categories = await this.getCategories(tenantId)
    const categoryMap = new Map(categories.map((c) => [c.id, c]))

    const inserts: any[] = []

    // 2. Prepare Inserts
    for (const unitId of unitIds) {
      for (const assignment of assignments) {
        const cat = categoryMap.get(assignment.categoryId)
        if (cat) {
          inserts.push({
            unit_id: unitId,
            category_id: assignment.categoryId,
            start_date: format(assignment.startDate, 'yyyy-MM-dd'),
            expiration_date: format(
              addMonths(assignment.startDate, cat.termMonths),
              'yyyy-MM-dd',
            ),
            status: 'Vigente',
            notes: `Gerado automaticamente em ${new Date().toLocaleDateString()}`,
          })
        }
      }
    }

    if (inserts.length === 0) return

    // 3. Delete existing for these units AND these categories to avoid duplicates
    // We want to overwrite configuration for the selected categories
    const categoryIds = assignments.map((a) => a.categoryId)
    const { error: deleteError } = await supabase
      .from('unit_warranties')
      .delete()
      .in('unit_id', unitIds)
      .in('category_id', categoryIds)

    if (deleteError) throw deleteError

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
