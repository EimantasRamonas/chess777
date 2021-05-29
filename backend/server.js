const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
var mysql = require("mysql2");
const crypto = require("crypto");
var bodyParser = require("body-parser");
var server = require("http").Server(express);
var io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Project123!",
  database: "chess",
});
const secret = "abcdefg";
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Tekimooo998m766@gmail.com",
    pass: "AWIMdwaimda8wn8323bb",
  },
});

server.listen(8443);

var unratedQueue = new Array();
var ratedQueue = new Array();

io.on("connection", (socket) => {
  socket.emit("hello", "world");

  socket.on("hello", (arg) => {
    console.log(arg);
  });

  socket.on("joinGame", (arg) => {
    joinGame(arg.gameID, arg.username, socket);
    socket.id = arg.username;
  });

  socket.on("disconnect", function () {
    //console.log("User disconnected: " + socket.id);
  });

  socket.on("send_color", (arg) => {
    let query_str =
      "SELECT white_username, black_username from games WHERE game_id='" +
      arg.gameID +
      "'";
    connection.query(query_str, function (err, rows, fields) {
      // console.log("WHITE USERNAME: " + rows[0].white_username);
      // console.log("CLIENT USERNAME: " + arg.username);
      // if (rows[0].white_username == arg.username) {
      //   console.log("THIS GUY IS WHITE " + arg.username);
      //   let data = {
      //     username: arg.username,
      //     color: 0,
      //   };
      //   socket.emit("get_color", data);
      // } else {
      //   console.log("THIS GUY IS BLACK " + arg.username);
      //   let data = {
      //     username: arg.username,
      //     color: 1,
      //   };
      //   socket.emit("get_color", data);
      // }

      let data = {
        white_username: rows[0].white_username,
        black_username: rows[0].black_username,
        gameID: arg.gameID,
      };
      console.log("THIS GUY IS WHITE " + data.white_username);
      console.log("THIS GUY IS BLACK " + data.black_username);

      socket.emit("get_color", data);

      if (err) throw err;
    });
  });

  socket.on("create_game_room", (arg) => {
    createGameRoom(arg.gameID, arg.username, socket);
  });

  socket.on("send_moves", (arg) => {
    getMoves(arg.gameID, arg.username, arg, socket);
  });
});

function getMoves(gameID, username, fen, socket) {
  var room = io.sockets.adapter.rooms.get(gameID);
  //console.log(room);
  //console.log(fen);

  io.to(gameID).emit("get_position", fen);
}

function createGameRoom(gameID, username, socket) {
  socket.join(gameID);
  var room = io.sockets.adapter.rooms.get(gameID);
  var playerIDS = [];

  if (room.size == 2) {
    room.forEach(getIDS);
  }

  function getIDS(value1, value2, set) {
    playerIDS.push(value1);
  }
}

function joinGame(gameID, username, socket) {
  var playerIDS = [];
  socket.join(gameID + "_init");
  var room = io.sockets.adapter.rooms.get(gameID + "_init");
  socket.username = username;
  // console.log(username);
  if (room.size == 1) {
    var p1_color = Math.round(Math.random());
    var p2_color;
    if (p1_color == 1) {
      socket.color = 0;
      p2_color = 0;
    } else {
      p2_color = 1;
      socket.color = 1;
    }

    updateGameTable();
  }
  if (room.size == 2) {
    io.to(gameID).emit("lol", "game can start!");

    room.forEach(getIDS);
    function getIDS(value1, value2, set) {
      playerIDS.push(value1);
    }

    var num;
    var q_string =
      "SELECT white_username from games WHERE game_id='" + gameID + "'";
    connection.query(q_string, function (err, rows, fields) {
      if (rows[0].white_username === null) {
        num = 0; // update yra is white
      } else {
        num = 1; // update yra is black
      }

      // socket.color = num;

      var p2_color;
      // if (socket.color == 1) {
      if (num == 1) {
        // jei update yra is black
        p1_color = 1; // pirmas zaidejas yra black
        p2_color = 0; // antras zaidejas yra white
      } else {
        // jei update yra is white
        p1_color = 0; // pirmas zaidejas yra white
        p2_color = 1; // antras zaidejas yra black
      }

      io.to(playerIDS[0]).emit("color", p1_color); // pirmam zaidjeui emittinu kad jis yra kazkokios spalvos
      io.to(playerIDS[1]).emit("color", p2_color); // antram zaidejui emittinu kad jis yra kazkokios spalvos
      updateGameTable(num);

      if (err) throw err;
    });
  }
  if (room.size == 3) {
    socket.leave(gameID);
  }

  // console.log(io.sockets.adapter.rooms);
  // console.log(io.sockets.adapter.rooms.get(gameID));
  // console.log(io.sockets.adapter.rooms.get(gameID).size);

  function updateGameTable(value) {
    let query1 =
      "SELECT count(1) as cnt from games WHERE game_id='" + gameID + "'";

    connection.query(query1, function (err, rows, fields) {
      let game_exists = rows[0].cnt;
      var query2;

      if (game_exists) {
        if (value == 0) {
          // if white
          query2 =
            "UPDATE games SET white_username='" +
            username +
            "' WHERE game_id='" +
            gameID +
            "'";
        } // if black
        else {
          query2 =
            "UPDATE games SET black_username='" +
            username +
            "' WHERE game_id='" +
            gameID +
            "'";
        }

        connection.query(query2, function (err, rows, fields) {
          if (err) throw err;
        });
      } else {
        if (value == 0) {
          // if white
          query2 =
            "INSERT into games (game_id, white_username) VALUES ('" +
            gameID +
            "','" +
            username +
            "')";
        } // if black
        else {
          query2 =
            "INSERT into games (game_id, black_username) VALUES ('" +
            gameID +
            "','" +
            username +
            "')";
        }
      }

      connection.query(query2, function (err, rows, fields) {
        if (err) throw err;
      });
      console.log(query2);

      if (err) throw err;
    });
  }
}

var jsonParser = bodyParser.json();

setInterval(checkUnratedQueue, 2000);
setInterval(checkRatedQueue, 2000);

function checkUnratedQueue() {
  //console.log(unratedQueue.length);
  if (unratedQueue.length >= 2) {
    let user1, user2;
    let temp;
    let gameID = makeid(10);

    user1 = unratedQueue[unratedQueue.length - 1];
    user2 = unratedQueue[unratedQueue.length - 2];

    console.log(user1 + " " + user2);

    let query =
      "INSERT into games (game_id, white_username, black_username, is_rated) VALUES ('" +
      gameID +
      "','" +
      user1 +
      "','" +
      user2 +
      "','" +
      1 +
      "')";

    connection.query(query, function (err, rows, fields) {
      unratedQueue.shift();
      unratedQueue.shift();

      let data = {
        user1: user1,
        user2: user2,
        gameID: gameID,
      };
      io.emit("gameFound", data);

      if (err) console.log(err);
    });
  }
}

async function joinUnratedQueue(username) {
  if (unratedQueue.includes(username)) return "inqueue";
  unratedQueue.push(username);
  return "joined";
}

function checkRatedQueue() {
  if (ratedQueue.length >= 2) {
    let user1, user2;
    let temp;
    let gameID = makeid(10);
    user1 = ratedQueue[ratedQueue.length - 1];
    user2 = ratedQueue[ratedQueue.length - 2];

    console.log(user1 + " " + user2);

    let query =
      "INSERT into games (game_id, white_username, black_username, is_rated) VALUES ('" +
      gameID +
      "','" +
      user1 +
      "','" +
      user2 +
      "','" +
      2 +
      "')";

    connection.query(query, function (err, rows, fields) {
      ratedQueue.shift();
      ratedQueue.shift();

      let data = {
        user1: user1,
        user2: user2,
        gameID: gameID,
      };
      io.emit("gameFound", data);

      if (err) console.log(err);
    });
  }
}

async function gameFinished(ourData) {
  var [user_rows] = await connection
    .promise()
    .query(
      "SELECT white_username,black_username FROM games where game_id = ?",
      [ourData.id]
    );
  if (user_rows == undefined || user_rows.length <= 0) {
    return "fail";
  }
  let winner = "";
  let loser = "";
  if (ourData.winner_name == "white") {
    winner = user_rows[0].white_username;
    loser = user_rows[0].black_username;
  } else {
    winner = user_rows[0].black_username;
    loser = user_rows[0].white_username;
  }
  var [rows] = await connection
    .promise()
    .query(
      "UPDATE games SET status = ?, moves = ?, outcome_type = ?, winner = ? WHERE game_id = ?",
      [
        ourData.status,
        JSON.stringify(ourData.moves),
        ourData.outcome_type,
        winner,
        ourData.id,
      ]
    );
  if (rows == undefined || rows.length <= 0) {
    return "fail";
  }
  console.log(ourData.type);
  if (ourData.type != 2) return "success";
  var [first_rows] = await connection
    .promise()
    .query("SELECT elo FROM users WHERE name = ?", [winner]);
  var [second_rows] = await connection
    .promise()
    .query("SELECT elo FROM users WHERE name = ?", [loser]);
  if (
    first_rows != undefined &&
    first_rows.length > 0 &&
    second_rows != undefined &&
    second_rows.length > 0
  ) {
    var [third_rows] = await connection
      .promise()
      .query("UPDATE users SET elo = ? WHERE name = ?", [
        first_rows[0].elo + 15,
        winner,
      ]);
    var [fourth_rows] = await connection
      .promise()
      .query("UPDATE users SET elo = ? WHERE name = ?", [
        second_rows[0].elo - 15,
        loser,
      ]);
    return "success";
  }
  return "fail";
}

async function joinRatedQueue(username) {
  if (ratedQueue.includes(username)) return "inqueue";
  ratedQueue.push(username);
  return "joined";
}

app.post("/getGameType", jsonParser, (req, res) => {
  let query =
    "SELECT is_rated from games where game_id ='" + req.body.gameID + "'";
  connection.query(query, function (err, rows, fields) {
    if (rows.length > 0) {
      let data = {
        gameID: req.body.gameID,
        gameType: rows[0].is_rated,
      };
      io.emit("gameTipas", JSON.stringify(data));
    }
  });
});

app.post("/joinUnratedQueue", jsonParser, async (req, res) => {
  //console.log(req.body);
  var result = await joinUnratedQueue(req.body.username);
  res.send({ placeholder: result });
});

app.post("/joinRatedQueue", jsonParser, async (req, res) => {
  var result = await joinRatedQueue(req.body.username);
  res.send({ placeholder: result });
});

app.post("/finishgame", jsonParser, async (req, res) => {
  var result = await gameFinished(req.body);
  res.send({ placeholder: result });
});

app.post("/banplayer", jsonParser, async (req, res) => {
  var ourData = JSON.parse(data);
  var [first_rows] = await connection
    .promise()
    .query("SELECT is_admin FROM users WHERE name = ?", [ourData.username]);
  if (first_rows != undefined && first_rows.length > 0) {
    if (first_rows[0].is_admin) {
      connection.query("UPDATE users SET is_banned = 1 WHERE user = ?", [
        ourData.banusername,
      ]);
      return "success";
    }
  }
  return "fail";
});

app.post("/createreport", jsonParser, (req, res) => {
  var ourData = JSON.parse(data);
  if (
    ourData.message.length == 0 ||
    ourData.username.length == 0 ||
    ourData.reportedusername.length == 0
  )
    return "fail";
  connection.query(
    "INSERT INTO Reports(reporter, reported_username, message) VALUES(?,?,?)",
    [ourData.username, ourData.reportedusername, ourData.message],
    function (err, rows, fields) {
      if (err) console.log(err);
      else return "success";
    }
  );
  return "fail";
});

app.post("/forgotcode", jsonParser, (req, res) => {
  connection.query(
    "SELECT count(id), user_id, email from user_recovery WHERE code = ?",
    [req.body.code],
    (err, first_rows) => {
      if (err) console.log(err);
      else if (first_rows !== undefined && first_rows.length > 0) {
        let r = Math.random().toString(36).substring(3);
        var hash = crypto.createHmac("sha256", secret).update(r).digest("hex");
        connection.query(
          "UPDATE users SET password = ? WHERE id = ?",
          [hash, first_rows[0].user_id],
          (err, rows) => {
            if (err) consolle.log(err);
            else {
              var mailOptions = {
                from: "Tekimooo998m766@gmail.com",
                to: first_rows[0].email,
                subject: "Password Recovery",
                text: "Your new password is:" + r,
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                  res.send({ placeholder: "EmailSent" });
                }
              });
              connection.query(
                "UPDATE user_recovery SET used = 1 WHERE code = ?",
                [req.body.code]
              );
              res.send({ placeholder: "PasswordResetSuccess" });
            }
          }
        );
      }
    }
  );
});
app.post("/forgot", jsonParser, (req, res) => {
  connection.query(
    "SELECT id, email from users WHERE email = ?",
    [req.body.email],
    function (err, first_rows, fields) {
      if (err) throw err;
      else if (first_rows !== undefined && first_rows.length > 0) {
        let r = Math.random().toString(36).substring(7);
        connection.query(
          "INSERT INTO user_recovery(user_id,email, code,used) VALUES (?,?,?,0)",
          [first_rows[0].id, first_rows[0].email, r],
          (err, rows) => {
            if (err) console.log(err);
            else {
              var mailOptions = {
                from: "Tekimooo998m766@gmail.com",
                to: first_rows[0].email,
                subject: "Password Recovery",
                text: "To change your e-mail, enter your secret code: " + r,
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                  res.send({ placeholder: "EmailSent" });
                }
              });
            }
          }
        );
      } else {
        res.send({ placeholder: "User not found" });
      }
    }
  );
});
app.post("/login", jsonParser, (req, res) => {
  console.log(req.body);
  var hash = crypto
    .createHmac("sha256", secret)
    .update(req.body.password)
    .digest("hex");

  connection.query("SELECT * from users", function (err, rows, fields) {
    if (err) throw err;

    var authBool = false;

    // probably need to add expiration or sth

    for (var i = 0; i < rows.length; i++) {
      if (rows[i].name == req.body.username && rows[i].password == hash) {
        res.send({
          token: "usertoken",
          name: rows[i].name,
          email: rows[i].email,
        });
        authBool = true;
      }
    }

    if (!authBool) {
      res.send({ placeholder: "Incorrect username or password" });
    }
  });
});
app.post("/register", jsonParser, (req, res) => {
  connection.query("SELECT * from users", function (err, rows, fields) {
    if (err) throw err;

    var validAccount = 0; // 0 - initial value, 1 - username taken, 2 - email taken
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].name == req.body.username) {
        validAccount = 1;
      }
    }

    for (var i = 0; i < rows.length; i++) {
      if (rows[i].email == req.body.email) {
        validAccount = 2;
      }
    }

    if (validAccount == 0) {
      let hash = crypto
        .createHmac("sha256", secret)
        .update(req.body.password)
        .digest("hex");
      let insertString =
        "INSERT INTO users (name, email, password) VALUES ('" +
        req.body.username +
        "', '" +
        req.body.email +
        "', '" +
        hash +
        "')";
      connection.query(insertString, function (err, rows, fields) {
        if (err) throw err;
      });
      connection.query("SELECT * from users", function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
      });
      console.log("Account created!");
      res.send({ message: "Account created!" });
    } else if (validAccount == 1) {
      console.log("Username taken");
      res.send({ message: "Username taken!" });
    } else if (validAccount == 2) {
      console.log("Email taken");
      res.send({ message: "Email taken!" });
    }
  });
});

function makeid(length) {
  var result = [];
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
}

app.listen(8000, () =>
  console.log("API is listening on port 8000 (8305 on OpenNebula).")
);
