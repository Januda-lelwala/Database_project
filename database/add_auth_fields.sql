-- Add authentication fields to driver and assistant tables

-- Add columns to driver table
ALTER TABLE driver 
ADD COLUMN user_name VARCHAR(50) UNIQUE AFTER email,
ADD COLUMN password VARCHAR(255) AFTER user_name;

-- Add columns to assistant table  
ALTER TABLE assistant
ADD COLUMN user_name VARCHAR(50) UNIQUE AFTER email,
ADD COLUMN password VARCHAR(255) AFTER user_name;

SELECT 'Authentication fields added to driver and assistant tables' AS status;
