import { supabase } from '@/lib/supabase/client'
import {
  ProjectDocument,
  DocumentVersion,
  DocumentVisibility,
  DocumentCategory,
} from '@/types'

// UUID validation helper
const isValidUUID = (uuid: string) => {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return regex.test(uuid)
}

export const documentService = {
  // Fetch documents for a project (optionally filtered by unit)
  async getDocuments(projectId: string, unitId?: string) {
    // Validate project ID format to prevent DB errors
    if (!isValidUUID(projectId)) {
      console.warn(
        `Invalid UUID format for projectId: ${projectId}. Skipping fetch.`,
      )
      return []
    }

    // Validate unit ID format if provided
    if (unitId && !isValidUUID(unitId)) {
      console.warn(`Invalid UUID format for unitId: ${unitId}. Skipping fetch.`)
      return []
    }

    let query = supabase
      .from('documents')
      .select('*')
      .eq('project_id', projectId)

    if (unitId) {
      query = query.eq('unit_id', unitId)
    } else {
      // If no unitId provided, fetch project-level documents (where unit_id is null)
      query = query.is('unit_id', null)
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    })

    if (error) throw error

    // Map to frontend type
    return data.map((doc) => ({
      id: doc.id,
      projectId: doc.project_id,
      unitId: doc.unit_id,
      name: doc.title,
      description: doc.description,
      category: doc.category as DocumentCategory,
      version: doc.current_version,
      tags: [], // Tags not in DB schema yet, returning empty
      visibility: doc.visibility as DocumentVisibility,
      isVisibleToOwners:
        doc.visibility === 'SHARED' || doc.visibility === 'PUBLIC',
      url: '', // We generate signed URL on demand or list versions
      createdAt: doc.created_at,
      createdBy: doc.created_by,
      size: (doc.file_size / (1024 * 1024)).toFixed(2) + ' MB',
      type: doc.file_type,
    })) as ProjectDocument[]
  },

  // Fetch documents for an owner
  async getOwnerDocuments(ownerUnitsIds: string[]) {
    // Filter out invalid IDs
    const validUnitIds = ownerUnitsIds.filter(isValidUUID)

    if (validUnitIds.length === 0) return []

    // This is complex with simple query, assuming we fetch all PUBLIC/SHARED docs for projects owner is part of
    // For simplicity/mock compatibility: Fetch all docs that are SHARED/PUBLIC and linked to units owner owns OR project level

    // In a real app we'd use a RPC function or smarter query.
    // Here: Fetch all SHARED/PUBLIC docs
    const { data, error } = await supabase
      .from('documents')
      .select('*, projects(name)')
      .in('visibility', ['SHARED', 'PUBLIC'])
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map((doc) => ({
      id: doc.id,
      projectId: doc.project_id,
      unitId: doc.unit_id,
      name: doc.title,
      description: doc.description,
      category: doc.category as DocumentCategory,
      version: doc.current_version,
      tags: [doc.projects?.name].filter(Boolean),
      visibility: doc.visibility as DocumentVisibility,
      isVisibleToOwners: true,
      url: '',
      createdAt: doc.created_at,
      createdBy: doc.created_by,
      size: (doc.file_size / (1024 * 1024)).toFixed(2) + ' MB',
      type: doc.file_type,
    })) as ProjectDocument[]
  },

  // Upload new document
  async uploadDocument(
    file: File,
    metadata: {
      projectId: string
      unitId?: string
      title: string
      description: string
      category: string
      visibility: string
      userId: string
    },
  ) {
    if (!isValidUUID(metadata.projectId)) throw new Error('Invalid Project ID')

    // 1. Upload file to storage
    const fileExt = file.name.split('.').pop()
    const filePath = `${metadata.projectId}/${Date.now()}_${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // 2. Insert into documents table
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert({
        project_id: metadata.projectId,
        unit_id:
          metadata.unitId && isValidUUID(metadata.unitId)
            ? metadata.unitId
            : null,
        title: metadata.title,
        description: metadata.description,
        category: metadata.category,
        visibility: metadata.visibility,
        current_version: 1,
        file_type: fileExt,
        file_size: file.size,
        created_by: metadata.userId,
      })
      .select()
      .single()

    if (docError) throw docError

    // 3. Insert into document_versions table
    const { error: verError } = await supabase
      .from('document_versions')
      .insert({
        document_id: docData.id,
        version_number: 1,
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
        file_type: fileExt || 'unknown',
        created_by: metadata.userId,
      })

    if (verError) throw verError

    return docData
  },

  // Upload new version
  async uploadNewVersion(
    documentId: string,
    file: File,
    userId: string,
    currentVersion: number,
  ) {
    if (!isValidUUID(documentId)) throw new Error('Invalid Document ID')

    // 1. Upload file to storage
    const filePath = `versions/${documentId}/${Date.now()}_${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const newVersion = currentVersion + 1

    // 2. Insert into document_versions
    const { error: verError } = await supabase
      .from('document_versions')
      .insert({
        document_id: documentId,
        version_number: newVersion,
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
        file_type: file.name.split('.').pop() || 'unknown',
        created_by: userId,
      })

    if (verError) throw verError

    // 3. Update documents table
    const { error: docError } = await supabase
      .from('documents')
      .update({
        current_version: newVersion,
        updated_at: new Date().toISOString(),
        file_size: file.size,
        file_type: file.name.split('.').pop(),
      })
      .eq('id', documentId)

    if (docError) throw docError
  },

  async getVersions(documentId: string) {
    if (!isValidUUID(documentId)) return []

    const { data, error } = await supabase
      .from('document_versions')
      .select('*')
      .eq('document_id', documentId)
      .order('version_number', { ascending: false })

    if (error) throw error
    return data as DocumentVersion[]
  },

  async getDownloadUrl(path: string) {
    const { data } = await supabase.storage
      .from('documents')
      .createSignedUrl(path, 60) // 1 minute

    return data?.signedUrl
  },

  async getLatestVersionPath(documentId: string) {
    if (!isValidUUID(documentId)) return null

    const { data, error } = await supabase
      .from('document_versions')
      .select('file_path')
      .eq('document_id', documentId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single()

    if (error) return null
    return data.file_path
  },

  async updateVisibility(documentId: string, visibility: DocumentVisibility) {
    if (!isValidUUID(documentId)) throw new Error('Invalid Document ID')

    const { error } = await supabase
      .from('documents')
      .update({ visibility })
      .eq('id', documentId)

    if (error) throw error
  },
}
