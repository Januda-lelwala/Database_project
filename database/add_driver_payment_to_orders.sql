-- Add driver_id and payment_method columns to orders table

ALTER TABLE orders 
ADD COLUMN driver_id VARCHAR(40) NULL AFTER status,
ADD COLUMN payment_method ENUM('Cash', 'Card') DEFAULT 'Cash' AFTER driver_id;

-- Add foreign key constraint
ALTER TABLE orders
ADD CONSTRAINT fk_orders_driver
FOREIGN KEY (driver_id) REFERENCES driver(driver_id)
ON DELETE SET NULL
ON UPDATE CASCADE;

SELECT 'Driver and payment method fields added to orders table' AS status;
