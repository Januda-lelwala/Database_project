-- Insert order items only

-- Insert order items for ORD001
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price) VALUES
('OI0001', 'ORD001', 'P001', 5, 600.00),
('OI0002', 'ORD001', 'P002', 3, 450.00),
('OI0003', 'ORD001', 'P003', 2, 1200.00);

-- Insert order items for ORD002
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price) VALUES
('OI0004', 'ORD002', 'P001', 10, 600.00),
('OI0005', 'ORD002', 'PROD004', 5, 500.00);

-- Insert order items for ORD003
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price) VALUES
('OI0006', 'ORD003', 'P002', 8, 450.00),
('OI0007', 'ORD003', 'P003', 4, 1200.00),
('OI0008', 'ORD003', 'P001', 6, 600.00);

-- Insert order items for ORD004
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price) VALUES
('OI0009', 'ORD004', 'P001', 15, 600.00),
('OI0010', 'ORD004', 'P002', 7, 450.00);

-- Insert order items for ORD005 (delivered)
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price) VALUES
('OI0011', 'ORD005', 'P003', 10, 1200.00),
('OI0012', 'ORD005', 'PROD004', 5, 500.00);

-- Insert order items for ORD006 (delivered)
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price) VALUES
('OI0013', 'ORD006', 'P001', 20, 600.00),
('OI0014', 'ORD006', 'P002', 8, 450.00);

SELECT 'Order items created successfully' AS status;
SELECT COUNT(*) as total_items FROM order_item;
