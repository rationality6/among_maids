const gameRooms = {
  // [roomKey]: {
  // users: [],
  // randomTasks: [],
  // scores: [],
  // gameScore: 0,
  // players: {},
  // numPlayers: 0
  // }
};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🤪 a user connected");
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    // disconnect
    socket.on("disconnect", () => {
      //find which room they belong to
      let roomKey = 0;
      for (let keys1 in gameRooms) {
        for (let keys2 in gameRooms[keys1]) {
          Object.keys(gameRooms[keys1][keys2]).map((el) => {
            if (el === socket.id) {
              roomKey = keys1;
            }
          });
        }
      }

      const roomInfo = gameRooms[roomKey];

      if (roomInfo) {
        console.log("user disconnected: ", socket.id);
        // remove this player from our players object
        delete roomInfo.players[socket.id];
        // update numPlayers
        roomInfo.numPlayers = Object.keys(roomInfo.players).length;
        // emit a message to all players to remove this player
        io.to(roomKey).emit("disconnected", {
          playerId: socket.id,
          numPlayers: roomInfo.numPlayers,
        });
      }
    });

    // when a player moves, update the player data
    socket.on("playerMovement", function (data) {
      const { x, y, roomKey } = data;
      gameRooms[roomKey].players[socket.id].x = x;
      gameRooms[roomKey].players[socket.id].y = y;
      // emit a message to all players about the player that moved
      socket
        .to(roomKey)
        .emit("playerMoved", gameRooms[roomKey].players[socket.id]);
    });

    socket.on("getRoomCode", async () => {
      if (Object.keys(gameRooms).length > 0) {
        socket.emit("roomCreated", Object.keys(gameRooms)[0]);
        return;
      }

      let key = codeGenerator();
      while (Object.keys(gameRooms).includes(key)) {
        key = codeGenerator();
      }
      gameRooms[key] = {
        roomKey: key,
        players: {},
        numPlayers: 0,
      };
      socket.emit("roomCreated", key);
    });

    socket.on("joinRoom", (roomKey) => {
      socket.join(roomKey);

      const roomInfo = gameRooms[roomKey];
      console.log("roomInfo", roomInfo);
      roomInfo.players[socket.id] = {
        rotation: 0,
        x: 400,
        y: 300,
        playerId: socket.id,
      };

      // update number of players
      roomInfo.numPlayers = Object.keys(roomInfo.players).length;

      // set initial state
      // socket.emit("setState", roomInfo);
    });
  });
};

function codeGenerator() {
  let code = "";
  let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
