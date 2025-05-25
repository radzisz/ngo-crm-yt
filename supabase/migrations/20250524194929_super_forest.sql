/*
  # Add custom fields to document templates

  1. Changes
    - Add custom_fields column to document_templates table to store field definitions
*/

ALTER TABLE document_templates
ADD COLUMN IF NOT EXISTS custom_fields jsonb DEFAULT '[]';