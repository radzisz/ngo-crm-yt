/*
  # Add sample persons

  1. Changes
    - Add 5 random persons to the persons table
*/

INSERT INTO persons (firstName, lastName, email, phone)
VALUES
  ('Sarah', 'Johnson', 'sarah.johnson@example.com', '555-0123'),
  ('Michael', 'Chen', 'michael.chen@example.com', '555-0124'),
  ('Emma', 'Rodriguez', 'emma.rodriguez@example.com', '555-0125'),
  ('David', 'Smith', 'david.smith@example.com', '555-0126'),
  ('Olivia', 'Williams', 'olivia.williams@example.com', '555-0127')
ON CONFLICT DO NOTHING;