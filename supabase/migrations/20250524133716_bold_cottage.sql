/*
  # Add contractor fields to persons table

  1. Changes
    - Add birth date field
    - Add PESEL field
    - Add address fields (street, city, postal code, country)
    - Add bank account field
*/

ALTER TABLE persons
ADD COLUMN IF NOT EXISTS birth_date date,
ADD COLUMN IF NOT EXISTS pesel text,
ADD COLUMN IF NOT EXISTS street text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS postal_code text,
ADD COLUMN IF NOT EXISTS country text DEFAULT 'PL',
ADD COLUMN IF NOT EXISTS bank_account text;