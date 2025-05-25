/*
  # Remove status column from contracts table

  1. Changes
    - Remove the status column from contracts table
*/

ALTER TABLE contracts
DROP COLUMN IF EXISTS status;