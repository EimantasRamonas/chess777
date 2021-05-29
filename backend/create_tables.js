var mysql = require("mysql2");
// change these values to what your database is
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Project123!",
  database: "chess",
});

q1 =
  "CREATE TABLE `games` (`id` int NOT NULL,`game_id` varchar(50) NOT NULL,`white_username` varchar(50) DEFAULT NULL,`black_username` varchar(50) DEFAULT NULL,`status` varchar(64) DEFAULT NULL,`is_rated` smallint NOT NULL DEFAULT '0',`moves` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,`outcome_type` varchar(64) DEFAULT NULL,`winner` varchar(64) DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;";
q2 =
  "CREATE TABLE `users` (`id` bigint UNSIGNED NOT NULL,`name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,`email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,`email_verified_at` timestamp NULL DEFAULT NULL,`password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,`remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,`elo` int DEFAULT '1000',`is_admin` bit(1) NOT NULL DEFAULT b'0',`is_banned` bit(1) NOT NULL DEFAULT b'0') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
q3 =
  "CREATE TABLE `Reports` (`id` int NOT NULL,`reporter` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,`reported_username` varchar(64) NOT NULL,`message` varchar(500) NOT NULL,`result` int NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;";
q4 = "DROP TABLE IF EXISTS `games`";
q5 = "DROP TABLE IF EXISTS `users`";
q6 = "DROP TABLE IF EXISTS `Reports`";
q7 =
  "CREATE TRIGGER `games_update` BEFORE UPDATE ON `games`FOR EACH ROW BEGINIF OLD.white_username IS NOT NULL THENSET NEW.white_username = OLD.white_username;END IF; IF OLD.black_username IS NOT NULL THENSET NEW.black_username = OLD.black_username;END IF;IF OLD.game_id IS NOT NULL THENSET NEW.game_id = OLD.game_id;END IF;END";

connection.query(q4, function (err, rows, fields) {
  connection.query(q1, function (err, rows, fields) {
    connection.query(q5, function (err, rows, fields) {
      connection.query(q2, function (err, rows, fields) {
        connection.query(q6, function (err, rows, fields) {
          connection.query(q3, function (err, rows, fields) {
            connection.query(q7, function (err, rows, fields) {
              if (err) throw err;
              console.log("Database tables created!");
              process.exit(1);
            });
            if (err) throw err;
          });
          if (err) throw err;
        });
        if (err) throw err;
      });
      if (err) throw err;
    });
    if (err) throw err;
  });
  if (err) throw err;
});
