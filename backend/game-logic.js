var sio;
var gameSocket;

const initializeGame = (io, client) => {
  sio = io;
  gameSocket = client;

  gameSocket.on("disconnect", onDisconnect);
  gameSocket.on("new move", newMove);
  gameSocket.on("createNewGame", createNewGame);
  gameSocket.on("playerJoinGame", playerJoinGame);
  gameSocket.on("request username", requestUsername);
  gameSocket.on("received username", receivedUsername);
};

function onDisconnect();
function newMove();
function createNewGame();
function playerJoinGame();
function requestUsername();
function receivedUsername();

exports.initializeGame = initializeGame;
