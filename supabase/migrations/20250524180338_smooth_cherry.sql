/*
  # Rename required_variables to custom_variables

  1. Changes
    - Rename required_variables column to custom_variables in document_templates table
*/

ALTER TABLE document_templates
RENAME COLUMN required_variables TO custom_variables;