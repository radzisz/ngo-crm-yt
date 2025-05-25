/*
  # Remove is_complete field from persons table

  1. Changes
    - Remove is_complete column from persons table since completeness can be determined by checking completeness_problems array
*/

ALTER TABLE persons
DROP COLUMN IF EXISTS is_complete;