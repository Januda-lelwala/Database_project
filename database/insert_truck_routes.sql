-- Insert sample truck routes for testing

-- Colombo routes
INSERT INTO truck_route (route_id, store_id, route_name, max_minutes) VALUES
('TR_COL_01', 'ST_COL', 'Colombo City North', 180),
('TR_COL_02', 'ST_COL', 'Colombo City South', 200),
('TR_COL_03', 'ST_COL', 'Colombo Suburbs East', 240),
('TR_COL_04', 'ST_COL', 'Colombo Suburbs West', 220);

-- Kandy routes
INSERT INTO truck_route (route_id, store_id, route_name, max_minutes) VALUES
('TR_KAN_01', 'ST_KAN', 'Kandy City Central', 150),
('TR_KAN_02', 'ST_KAN', 'Kandy Hill Country', 300),
('TR_KAN_03', 'ST_KAN', 'Kandy Peradeniya Route', 180);

-- Galle routes
INSERT INTO truck_route (route_id, store_id, route_name, max_minutes) VALUES
('TR_GAL_01', 'ST_GAL', 'Galle Fort Area', 120),
('TR_GAL_02', 'ST_GAL', 'Galle South Coast', 240),
('TR_GAL_03', 'ST_GAL', 'Galle Inland Route', 200);

-- Negombo routes
INSERT INTO truck_route (route_id, store_id, route_name, max_minutes) VALUES
('TR_NEG_01', 'ST_NEG', 'Negombo Beach Road', 150),
('TR_NEG_02', 'ST_NEG', 'Negombo City Express', 120),
('TR_NEG_03', 'ST_NEG', 'Negombo Airport Route', 180);

SELECT 'Truck routes created successfully' AS status;

-- Display summary
SELECT 
    tr.route_id,
    tr.route_name,
    s.name as store_name,
    s.city,
    tr.max_minutes
FROM truck_route tr
JOIN store s ON tr.store_id = s.store_id
ORDER BY s.city, tr.route_id;
