/*
  # Add completeness tracking columns to persons table

  1. Changes
    - Add is_complete boolean column
    - Add completeness_problems text array column
*/

ALTER TABLE persons
ADD COLUMN IF NOT EXISTS is_complete boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS completeness_problems text[] DEFAULT '{}';