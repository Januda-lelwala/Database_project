-- Insert sample orders for driver portal testing

-- Insert orders
INSERT INTO orders (order_id, customer_id, order_date, destination_city, destination_address, status, driver_id, payment_method, created_at, updated_at) VALUES
('ORD001', 'CUS001', NOW(), 'Colombo', '123 Galle Road, Colombo 03', 'scheduled', 'DRV001', 'Cash', NOW(), NOW()),
('ORD002', 'CUS002', NOW(), 'Kandy', '456 Peradeniya Road, Kandy', 'in_transit', 'DRV001', 'Card', NOW(), NOW()),
('ORD003', 'CUS003', NOW(), 'Galle', '789 Main Street, Galle', 'pending', 'DRV001', 'Cash', NOW(), NOW()),
('ORD004', 'CUS004', NOW(), 'Negombo', '321 Beach Road, Negombo', 'scheduled', 'DRV002', 'Card', NOW(), NOW()),
('ORD005', 'CUS001', NOW(), 'Colombo', '555 Duplication Road, Colombo 04', 'delivered', 'DRV001', 'Cash', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
('ORD006', 'CUS002', NOW(), 'Colombo', '888 Hyde Park Corner, Colombo 02', 'delivered', 'DRV001', 'Cash', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

-- Insert order items for ORD001
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price) VALUES
('OI0001', 'ORD001', 'P001', 5, 250.00),
('OI0002', 'ORD001', 'P002', 3, 450.00),
('OI0003', 'ORD001', 'P003', 2, 180.00);

-- Insert order items for ORD002
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price) VALUES
('OI0004', 'ORD002', 'P001', 10, 250.00),
('OI0005', 'ORD002', 'P004', 5, 320.00);

-- Insert order items for ORD003
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price) VALUES
('OI0006', 'ORD003', 'P002', 8, 450.00),
('OI0007', 'ORD003', 'P003', 4, 180.00),
('OI0008', 'ORD003', 'P005', 6, 280.00);

-- Insert order items for ORD004
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price) VALUES
('OI0009', 'ORD004', 'P001', 15, 250.00),
('OI0010', 'ORD004', 'P002', 7, 450.00);

-- Insert order items for ORD005 (delivered)
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price) VALUES
('OI0011', 'ORD005', 'P003', 10, 180.00),
('OI0012', 'ORD005', 'P004', 5, 320.00);

-- Insert order items for ORD006 (delivered)
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price) VALUES
('OI0013', 'ORD006', 'P001', 20, 250.00),
('OI0014', 'ORD006', 'P005', 8, 280.00);

SELECT 'Sample orders and order items created successfully' AS status;

-- Show summary
SELECT 
    o.order_id,
    o.customer_id,
    c.name as customer_name,
    o.destination_city,
    o.status,
    o.driver_id,
    o.payment_method,
    COUNT(oi.order_item_id) as item_count,
    SUM(oi.quantity * oi.unit_price) as order_value
FROM orders o
LEFT JOIN customer c ON o.customer_id = c.customer_id
LEFT JOIN order_item oi ON o.order_id = oi.order_id
GROUP BY o.order_id
ORDER BY o.created_at DESC;
