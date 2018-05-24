CREATE EVENT `clean_empty_rooms`
ON SCHEDULE
	EVERY 1 DAY
	STARTS (TIMESTAMP(CURRENT_DATE) + INTERVAL 2 HOUR)
	ON COMPLETION PRESERVE
DO BEGIN
	# Delete rooms inactive from 2 days or more
	DELETE FROM rooms WHERE DATEDIFF(CURDATE(), updated_at) > 1;

	# Delete entries form the pivot table that are not part of an existing room
	DELETE FROM room_user WHERE id NOT IN (
		SELECT ru.id FROM (SELECT * FROM room_user) AS ru 
			JOIN rooms ON rooms.id = ru.room_id
	);

	# Delete entries form the pivot table that are part of an empty room
	DELETE FROM room_user WHERE id IN (
		SELECT ru.id FROM (SELECT * FROM room_user) AS ru 
			JOIN rooms ON rooms.id = ru.room_id 
		WHERE rooms.members = 0
	);
END;