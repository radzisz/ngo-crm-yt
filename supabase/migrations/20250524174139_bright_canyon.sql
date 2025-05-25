/*
  # Add person details fields to contracts table

  1. Changes
    - Add fields to store person details at the time of contract creation
    - These fields will be a snapshot of the person's data when the contract is created
*/

ALTER TABLE contracts
ADD COLUMN IF NOT EXISTS person_firstname text,
ADD COLUMN IF NOT EXISTS person_lastname text,
ADD COLUMN IF NOT EXISTS person_email text,
ADD COLUMN IF NOT EXISTS person_phone text,
ADD COLUMN IF NOT EXISTS person_birth_date date,
ADD COLUMN IF NOT EXISTS person_pesel text,
ADD COLUMN IF NOT EXISTS person_street text,
ADD COLUMN IF NOT EXISTS person_city text,
ADD COLUMN IF NOT EXISTS person_postal_code text,
ADD COLUMN IF NOT EXISTS person_country text,
ADD COLUMN IF NOT EXISTS person_bank_account text;