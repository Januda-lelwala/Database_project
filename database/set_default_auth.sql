-- Set default authentication credentials for existing drivers and assistants
-- Default password for drivers: driver123
-- Default password for assistants: assistant123

UPDATE driver SET user_name = 'driver1', password = '$2a$12$YqLeco129GfWWM/nT0ScRukR3Gs4vNPy8iDltZNKDeAFLb3P7GeNO' WHERE driver_id = 'DRV001';
UPDATE driver SET user_name = 'driver2', password = '$2a$12$YqLeco129GfWWM/nT0ScRukR3Gs4vNPy8iDltZNKDeAFLb3P7GeNO' WHERE driver_id = 'DRV002';
UPDATE assistant SET user_name = 'assistant1', password = '$2a$12$5iKMjyGIBM9OsY8WiOEAruiweyf5TbFI.8oTwNGChjJDKxDNrfXQW' WHERE assistant_id = 'AST001';
UPDATE assistant SET user_name = 'assistant2', password = '$2a$12$5iKMjyGIBM9OsY8WiOEAruiweyf5TbFI.8oTwNGChjJDKxDNrfXQW' WHERE assistant_id = 'AST002';

SELECT 'Default credentials set' AS status;
SELECT driver_id, name, user_name FROM driver;
SELECT assistant_id, name, user_name FROM assistant;
