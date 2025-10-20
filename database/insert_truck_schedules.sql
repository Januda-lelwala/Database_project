-- Insert sample truck schedules

-- Schedule 1: Today's morning schedule
INSERT INTO truck_schedule (truck_schedule_id, route_id, truck_id, driver_id, assistant_id, start_time, end_time) VALUES
('TS0001', 'TR_COL_01', 'TK01', 'DRV001', 'AST001', DATE_ADD(CURDATE(), INTERVAL 8 HOUR), DATE_ADD(CURDATE(), INTERVAL 11 HOUR));

-- Schedule 2: Today's afternoon schedule
INSERT INTO truck_schedule (truck_schedule_id, route_id, truck_id, driver_id, assistant_id, start_time, end_time) VALUES
('TS0002', 'TR_COL_02', 'TK02', 'DRV002', 'AST002', DATE_ADD(CURDATE(), INTERVAL 14 HOUR), DATE_ADD(CURDATE(), INTERVAL 17 HOUR));

-- Schedule 3: Tomorrow's morning schedule
INSERT INTO truck_schedule (truck_schedule_id, route_id, truck_id, driver_id, assistant_id, start_time, end_time) VALUES
('TS0003', 'TR_KAN_01', 'TK03', 'DRV001', 'AST001', DATE_ADD(CURDATE(), INTERVAL 32 HOUR), DATE_ADD(CURDATE(), INTERVAL 35 HOUR));

-- Schedule 4: Tomorrow's afternoon schedule
INSERT INTO truck_schedule (truck_schedule_id, route_id, truck_id, driver_id, assistant_id, start_time, end_time) VALUES
('TS0004', 'TR_GAL_01', 'TK04', 'DRV002', 'AST002', DATE_ADD(CURDATE(), INTERVAL 38 HOUR), DATE_ADD(CURDATE(), INTERVAL 40 HOUR));

-- Schedule 5: Yesterday (completed)
INSERT INTO truck_schedule (truck_schedule_id, route_id, truck_id, driver_id, assistant_id, start_time, end_time) VALUES
('TS0005', 'TR_NEG_01', 'TK01', 'DRV001', 'AST001', DATE_SUB(NOW(), INTERVAL 20 HOUR), DATE_SUB(NOW(), INTERVAL 17 HOUR));

SELECT 'Truck schedules created successfully' AS status;

-- Display summary
SELECT 
    ts.truck_schedule_id,
    tr.route_name,
    t.license_plate as truck,
    d.name as driver,
    a.name as assistant,
    ts.start_time,
    ts.end_time
FROM truck_schedule ts
JOIN truck_route tr ON ts.route_id = tr.route_id
JOIN truck t ON ts.truck_id = t.truck_id
JOIN driver d ON ts.driver_id = d.driver_id
JOIN assistant a ON ts.assistant_id = a.assistant_id
ORDER BY ts.start_time DESC;
