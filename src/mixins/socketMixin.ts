export default {
  setSocketEvents() {
    this.socket = io();

    this.socket.emit("getRoomCode");

    this.socket.on("roomCreated", (roomKey) => {
      this.roomKey = roomKey;
      this.socket.emit("joinRoom", this.roomKey);
    });

    // JOINED ROOM - SET STATE
    this.socket.on("setState", (state) => {
      const { roomKey, players, numPlayers } = state;

      // STATE
      this.roomKey = roomKey;
      this.players = players;
      this.numPlayers = numPlayers;
    });

    this.socket.on("playerMoved", (playerInfo) => {
      this.otherPlayers.getChildren().forEach((otherPlayer) => {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
      });
    });

    // PLAYERS
    this.socket.on("currentPlayers", (arg) => {
      const { players, numPlayers } = arg;
      this.numPlayers = numPlayers;
      Object.keys(players).forEach((id) => {
        if (players[id].playerId === this.socket.id) {
          this.addPlayer(players[id]);
        } else {
          this.addOtherPlayers(players[id]);
        }
      });
    });

    this.socket.on("newPlayer", (arg) => {
      const { playerInfo, numPlayers } = arg;
      this.addOtherPlayers(playerInfo);
      this.numPlayers = numPlayers;
    });

    // DISCONNECT
    this.socket.on("disconnected", (arg) => {
      const { playerId, numPlayers } = arg;
      this.numPlayers = numPlayers;
      this.otherPlayers.getChildren().forEach((otherPlayer) => {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy();
        }
      });
    });
  },
};
