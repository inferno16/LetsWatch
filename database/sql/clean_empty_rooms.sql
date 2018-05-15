CREATE EVENT `clean_empty_rooms`
ON SCHEDULE
	EVERY 1 DAY
	STARTS (TIMESTAMP(CURRENT_DATE) + INTERVAL 2 HOUR)
	ON COMPLETION PRESERVE
DO BEGIN
	#delete empty guest rooms
	DELETE FROM rooms WHERE guest_owner = TRUE AND id NOT IN (
		SELECT DISTINCT r.id FROM (SELECT * FROM rooms) AS r 
			JOIN room_user ON r.id = room_user.room_id
			JOIN users ON room_user.user_id = users.id
		WHERE r.guest_owner = TRUE
	);
	#delete rooms inactive for more than 1 day
	DELETE FROM rooms WHERE DATEDIFF(CURDATE(), inactive_from) > 1;
END;