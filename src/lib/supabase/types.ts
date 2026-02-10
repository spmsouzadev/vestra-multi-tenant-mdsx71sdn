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
      [_ in never]: never
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
