const getUserProcedure =
    `
   DELIMITER //

    CREATE PROCEDURE GetUserProc (
    IN p_user_param VARCHAR(255)
    )
    BEGIN
    SET @sql = 'SELECT * FROM users WHERE user_id = ? OR email = ?';
    PREPARE stmt FROM @sql;
    EXECUTE stmt USING p_user_param, p_user_param;
    DEALLOCATE PREPARE stmt;
    END //

    DELIMITER ;
    `;
exports.getUserProcedure = getUserProcedure;