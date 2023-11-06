import PhaserSceneTool from "./PhaserSceneTool";

import Aris from "../entities/Aris";

import ControlPanel from "../entities/ControlPanel";

class GameScene extends PhaserSceneTool {
  socket: any;

  backgroundImage: Phaser.GameObjects.Image;
  vendingMachine1: Phaser.GameObjects.Image;
  vendingMachine2: Phaser.GameObjects.Image;

  roomKey: string;
  roomKeyText: Phaser.GameObjects.Text;

  player: any;
  cursors: any;

  players: any;
  numPlayers: number;

  otherPlayers: Phaser.Physics.Arcade.Group;

  constructor() {
    super("GameScene");
  }

  create() {
    this.backgroundImage = this.add
      .image(0, 0, "mainroom")
      .setScale(0.5)
      .setOrigin(0, 0)
      .setDepth(0);

    // CONTROL PANELS
    this.controlPanelGroup = this.physics.add.staticGroup({
      classType: ControlPanel,
    });

    // CREATE OTHER PLAYERS GROUP
    this.otherPlayers = this.physics.add.group();

    this.controlPanelVendingMachine = this.controlPanelGroup.create(
      300,
      300,
      "vendingMachine"
    );

    this.controlPanelVendingMachine2 = this.controlPanelGroup.create(
      350,
      300,
      "vendingMachine"
    );

    this.controlPanelVendingMachine.on("pointerdown", () => {
      this.scene.switch("TaskScene");
    });
    this.controlPanelVendingMachine2.on("pointerdown", () => {
      this.scene.switch("TaskScene2");
    });

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
  }

  addPlayer(playerInfo) {
    this.player = new Aris(this, playerInfo.x, playerInfo.y);
  }

  addOtherPlayers(playerInfo) {
    const otherPlayer = new Aris(this, playerInfo.x, playerInfo.y);
    otherPlayer.playerId = playerInfo.playerId;
    this.otherPlayers.add(otherPlayer);
  }

  update() {
    // CONTROL PANEL OVERLAP
    if (this.player) {
      this.physics.add.overlap(
        this.player,
        this.controlPanelVendingMachine,
        this.highlightVendingMachine,
        null,
        this
      );
      //CONTROL PANEL: NOT OVERLAPPED
      this.checkOverlap(this.player, this.controlPanelVendingMachine);
    }
    if (this.player) {
      this.physics.add.overlap(
        this.player,
        this.controlPanelVendingMachine2,
        this.highlightVendingMachine,
        null,
        this
      );
      //CONTROL PANEL: NOT OVERLAPPED
      this.checkOverlap(this.player, this.controlPanelVendingMachine2);
    }
  }

  checkOverlap(player, vendingMachine) {
    const boundsPlayer = player.getBounds();
    const boundsPanel = vendingMachine.getBounds();
    if (
      !Phaser.Geom.Intersects.RectangleToRectangle(boundsPlayer, boundsPanel)
    ) {
      this.deactivateVendingMachine(vendingMachine);
    }
  }

  highlightVendingMachine(astronaut, vendingMachine) {
    vendingMachine.setTint(0xbdef83);
    vendingMachine.setInteractive();
  }

  deactivateVendingMachine(vendingMachine) {
    vendingMachine.clearTint();
    vendingMachine.disableInteractive();
  }
}

export default GameScene;
