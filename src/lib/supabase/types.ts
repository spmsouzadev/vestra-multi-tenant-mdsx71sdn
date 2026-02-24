// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1'
  }
  public: {
    Tables: {
      billing_history: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          invoice_number: string | null
          paid_at: string | null
          pdf_url: string | null
          status: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          invoice_number?: string | null
          paid_at?: string | null
          pdf_url?: string | null
          status: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          invoice_number?: string | null
          paid_at?: string | null
          pdf_url?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'billing_history_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      document_versions: {
        Row: {
          created_at: string | null
          created_by: string | null
          document_id: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          version_number: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          document_id?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          version_number: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          document_id?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: 'document_versions_document_id_fkey'
            columns: ['document_id']
            isOneToOne: false
            referencedRelation: 'documents'
            referencedColumns: ['id']
          },
        ]
      }
      documents: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          current_version: number
          description: string | null
          file_size: number | null
          file_type: string | null
          id: string
          project_id: string | null
          title: string
          unit_id: string | null
          updated_at: string | null
          visibility: string
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          current_version?: number
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          project_id?: string | null
          title: string
          unit_id?: string | null
          updated_at?: string | null
          visibility?: string
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          current_version?: number
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          project_id?: string | null
          title?: string
          unit_id?: string | null
          updated_at?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: 'documents_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'documents_unit_id_fkey'
            columns: ['unit_id']
            isOneToOne: false
            referencedRelation: 'units'
            referencedColumns: ['id']
          },
        ]
      }
      owners: {
        Row: {
          created_at: string | null
          document: string | null
          email: string
          id: string
          name: string
          phone: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          document?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          document?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          address: string | null
          city: string
          completion_percentage: number | null
          created_at: string | null
          delivered_units: number | null
          delivery_date: string | null
          id: string
          image_url: string | null
          manager: string
          name: string
          open_issues: number | null
          phase: string
          state: string
          status: string
          tenant_id: string | null
          total_units: number | null
        }
        Insert: {
          address?: string | null
          city: string
          completion_percentage?: number | null
          created_at?: string | null
          delivered_units?: number | null
          delivery_date?: string | null
          id?: string
          image_url?: string | null
          manager: string
          name: string
          open_issues?: number | null
          phase: string
          state: string
          status: string
          tenant_id?: string | null
          total_units?: number | null
        }
        Update: {
          address?: string | null
          city?: string
          completion_percentage?: number | null
          created_at?: string | null
          delivered_units?: number | null
          delivery_date?: string | null
          id?: string
          image_url?: string | null
          manager?: string
          name?: string
          open_issues?: number | null
          phase?: string
          state?: string
          status?: string
          tenant_id?: string | null
          total_units?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'projects_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      tenants: {
        Row: {
          cnpj: string
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          primary_color: string | null
          status: string
        }
        Insert: {
          cnpj: string
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          primary_color?: string | null
          status?: string
        }
        Update: {
          cnpj?: string
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          status?: string
        }
        Relationships: []
      }
      unit_warranties: {
        Row: {
          category_id: string | null
          created_at: string | null
          expiration_date: string
          id: string
          notes: string | null
          start_date: string
          status: string
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          expiration_date: string
          id?: string
          notes?: string | null
          start_date: string
          status?: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          expiration_date?: string
          id?: string
          notes?: string | null
          start_date?: string
          status?: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'unit_warranties_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'warranty_categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'unit_warranties_unit_id_fkey'
            columns: ['unit_id']
            isOneToOne: false
            referencedRelation: 'units'
            referencedColumns: ['id']
          },
        ]
      }
      units: {
        Row: {
          area: number | null
          bathrooms: number | null
          bedrooms: number | null
          block: string
          created_at: string | null
          floor: string
          id: string
          number: string
          owner_id: string | null
          price: number | null
          project_id: string | null
          status: string
          typology: string | null
        }
        Insert: {
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          block: string
          created_at?: string | null
          floor: string
          id?: string
          number: string
          owner_id?: string | null
          price?: number | null
          project_id?: string | null
          status?: string
          typology?: string | null
        }
        Update: {
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          block?: string
          created_at?: string | null
          floor?: string
          id?: string
          number?: string
          owner_id?: string | null
          price?: number | null
          project_id?: string | null
          status?: string
          typology?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'units_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'owners'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'units_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      warranty_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          tenant_id: string | null
          term_months: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          tenant_id?: string | null
          term_months?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string | null
          term_months?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'warranty_categories_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_tenant_stats: { Args: { tenant_uuid: string }; Returns: Json }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains constraints, RLS policies, functions, triggers,
// indexes and materialized views not present in the type definitions above.

// --- CONSTRAINTS ---
// Table: billing_history
//   PRIMARY KEY billing_history_pkey: PRIMARY KEY (id)
//   FOREIGN KEY billing_history_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: document_versions
//   FOREIGN KEY document_versions_created_by_fkey: FOREIGN KEY (created_by) REFERENCES auth.users(id)
//   FOREIGN KEY document_versions_document_id_fkey: FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
//   PRIMARY KEY document_versions_pkey: PRIMARY KEY (id)
// Table: documents
//   FOREIGN KEY documents_created_by_fkey: FOREIGN KEY (created_by) REFERENCES auth.users(id)
//   PRIMARY KEY documents_pkey: PRIMARY KEY (id)
//   FOREIGN KEY documents_project_id_fkey: FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
//   FOREIGN KEY documents_unit_id_fkey: FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
// Table: owners
//   PRIMARY KEY owners_pkey: PRIMARY KEY (id)
//   FOREIGN KEY owners_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id)
// Table: projects
//   PRIMARY KEY projects_pkey: PRIMARY KEY (id)
//   FOREIGN KEY projects_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: tenants
//   PRIMARY KEY tenants_pkey: PRIMARY KEY (id)
// Table: unit_warranties
//   FOREIGN KEY unit_warranties_category_id_fkey: FOREIGN KEY (category_id) REFERENCES warranty_categories(id) ON DELETE RESTRICT
//   PRIMARY KEY unit_warranties_pkey: PRIMARY KEY (id)
//   FOREIGN KEY unit_warranties_unit_id_fkey: FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
// Table: units
//   FOREIGN KEY units_owner_id_fkey: FOREIGN KEY (owner_id) REFERENCES owners(id)
//   PRIMARY KEY units_pkey: PRIMARY KEY (id)
//   FOREIGN KEY units_project_id_fkey: FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
// Table: warranty_categories
//   PRIMARY KEY warranty_categories_pkey: PRIMARY KEY (id)
//   FOREIGN KEY warranty_categories_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE

// --- ROW LEVEL SECURITY POLICIES ---
// Table: document_versions
//   Policy "Allow all access versions" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//   Policy "Allow read access versions" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
// Table: documents
//   Policy "Allow all access" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//   Policy "Allow read access" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
// Table: unit_warranties
//   Policy "Allow read access unit_warranties" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//   Policy "Allow write access unit_warranties" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
// Table: warranty_categories
//   Policy "Allow read access warranties" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//   Policy "Allow write access warranties" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)

// --- DATABASE FUNCTIONS ---
// FUNCTION get_tenant_stats(uuid)
//   CREATE OR REPLACE FUNCTION public.get_tenant_stats(tenant_uuid uuid)
//    RETURNS jsonb
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//     total_projects INTEGER;
//     total_units INTEGER;
//     total_owners INTEGER;
//     total_revenue NUMERIC;
//   BEGIN
//     -- Count projects for the tenant
//     SELECT COUNT(*) INTO total_projects
//     FROM projects
//     WHERE tenant_id = tenant_uuid;
//
//     -- Count units in projects belonging to the tenant
//     SELECT COUNT(*) INTO total_units
//     FROM units u
//     JOIN projects p ON u.project_id = p.id
//     WHERE p.tenant_id = tenant_uuid;
//
//     -- Count unique owners in units belonging to the tenant
//     SELECT COUNT(DISTINCT u.owner_id) INTO total_owners
//     FROM units u
//     JOIN projects p ON u.project_id = p.id
//     WHERE p.tenant_id = tenant_uuid
//     AND u.owner_id IS NOT NULL;
//
//     -- Sum total revenue from billing_history (sum of all amounts)
//     -- Using COALESCE to handle case with no billing history
//     SELECT COALESCE(SUM(amount), 0) INTO total_revenue
//     FROM billing_history
//     WHERE tenant_id = tenant_uuid;
//
//     -- Return the statistics as a JSONB object
//     RETURN jsonb_build_object(
//       'total_projects', total_projects,
//       'total_units', total_units,
//       'total_owners', total_owners,
//       'total_revenue', total_revenue
//     );
//   END;
//   $function$
//

// --- INDEXES ---
// Table: billing_history
//   CREATE INDEX idx_billing_history_tenant_due_date ON public.billing_history USING btree (tenant_id, due_date DESC)
//   CREATE INDEX idx_billing_history_tenant_id ON public.billing_history USING btree (tenant_id)
