/*
  # Add engagement to persons table

  1. Changes
    - Add engagement array column to persons table
*/

ALTER TABLE persons
ADD COLUMN IF NOT EXISTS engagement text[] DEFAULT '{}';