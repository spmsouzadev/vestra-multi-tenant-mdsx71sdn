import { supabase } from '@/lib/supabase/client'
import { Tenant, Project, Owner, BillingRecord } from '@/types'

export const tenantService = {
  async getTenants(): Promise<Tenant[]> {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      cnpj: row.cnpj,
      logoUrl: row.logo_url,
      primaryColor: row.primary_color,
      status: row.status,
      createdAt: row.created_at,
      projectCount: 0, // Will be enriched via stats or separate call
      adminEmail: row.admin_email,
      phone: row.phone,
      plan: row.plan,
      subscriptionStatus: row.subscription_status,
      lastPaymentDate: row.last_payment_date,
      storageUsed: row.storage_used,
    }))
  },

  async getTenantById(id: string): Promise<Tenant | null> {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      name: data.name,
      cnpj: data.cnpj,
      logoUrl: data.logo_url,
      primaryColor: data.primary_color,
      status: data.status,
      createdAt: data.created_at,
      projectCount: 0,
      adminEmail: data.admin_email,
      phone: data.phone,
      plan: data.plan,
      subscriptionStatus: data.subscription_status,
      lastPaymentDate: data.last_payment_date,
      storageUsed: data.storage_used,
    }
  },

  async updateTenant(id: string, updates: Partial<Tenant>): Promise<void> {
    const { error } = await supabase
      .from('tenants')
      .update({
        name: updates.name,
        cnpj: updates.cnpj,
        logo_url: updates.logoUrl,
        primary_color: updates.primaryColor,
        status: updates.status,
        admin_email: updates.adminEmail,
        phone: updates.phone,
        plan: updates.plan,
        subscription_status: updates.subscriptionStatus,
      })
      .eq('id', id)

    if (error) throw error
  },

  async getTenantStats(id: string) {
    const { data, error } = await supabase.rpc('get_tenant_stats', {
      tenant_uuid: id,
    })

    if (error) throw error
    // RPC returns an array of objects, we expect one row
    return data && data.length > 0
      ? data[0]
      : { project_count: 0, unit_count: 0, storage_used: 0 }
  },

  async getTenantProjects(id: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('tenant_id', id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map((p: any) => ({
      id: p.id,
      tenantId: p.tenant_id,
      name: p.name,
      city: p.city,
      state: p.state,
      manager: p.manager,
      address: p.address,
      totalUnits: p.total_units,
      deliveredUnits: p.delivered_units,
      openIssues: p.open_issues,
      completionPercentage: p.completion_percentage,
      deliveryDate: p.delivery_date,
      status: p.status,
      phase: p.phase,
      imageUrl: p.image_url,
    }))
  },

  async getTenantOwners(id: string): Promise<Owner[]> {
    // Get owners linked to units in projects of this tenant
    const { data, error } = await supabase
      .from('units')
      .select(
        `
        owner:owners(*),
        project:projects!inner(tenant_id)
      `,
      )
      .eq('project.tenant_id', id)
      .not('owner_id', 'is', null)

    if (error) throw error

    // Deduplicate owners
    const ownersMap = new Map<string, Owner>()
    data.forEach((item: any) => {
      if (item.owner && !ownersMap.has(item.owner.id)) {
        ownersMap.set(item.owner.id, {
          id: item.owner.id,
          name: item.owner.name,
          email: item.owner.email,
          phone: item.owner.phone || '',
          document: item.owner.document || '',
          unitsOwned: [],
        })
      }
    })

    return Array.from(ownersMap.values())
  },

  async getBillingHistory(id: string): Promise<BillingRecord[]> {
    const { data, error } = await supabase
      .from('billing_history')
      .select('*')
      .eq('tenant_id', id)
      .order('due_date', { ascending: false })

    if (error) throw error

    return data.map((row: any) => ({
      id: row.id,
      tenantId: row.tenant_id,
      invoiceNumber: row.invoice_number,
      amount: row.amount,
      status: row.status,
      dueDate: row.due_date,
      paidAt: row.paid_at,
      pdfUrl: row.pdf_url,
    }))
  },

  async resetTenantPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })
    if (error) throw error
    return true
  },
}
