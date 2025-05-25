/*
  # Remove status column from contracts table

  1. Changes
    - Drop status column from contracts table
*/

ALTER TABLE contracts
DROP COLUMN IF EXISTS status;