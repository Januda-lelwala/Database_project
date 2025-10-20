-- Assign drivers to existing orders for testing driver portal

-- Get order IDs and assign them
SET @order1 = (SELECT order_id FROM orders ORDER BY order_id LIMIT 1);
SET @order2 = (SELECT order_id FROM orders ORDER BY order_id LIMIT 1 OFFSET 1);

UPDATE orders SET driver_id = 'DRV001', payment_method = 'Cash', status = 'scheduled' WHERE order_id = @order1;
UPDATE orders SET driver_id = 'DRV001', payment_method = 'Card', status = 'in_transit' WHERE order_id = @order2;

SELECT 'Sample driver assignments created' AS status;
SELECT order_id, customer_id, driver_id, status, payment_method FROM orders WHERE driver_id IS NOT NULL;
