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
    this.controlPanelVendingMachine = this.controlPanelGroup.create(
      300,
      300,
      "vendingMachine"
    );

    this.vendingMachine1 = this.add
      .image(280, 280, "vendingMachine")
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(1);

    this.vendingMachine2 = this.add
      .image(350, 280, "vendingMachine")
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(1);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.socket = io();

    this.socket.emit("getRoomCode");

    this.socket.on("roomCreated", (roomKey) => {
      this.roomKey = roomKey;
      this.socket.emit("joinRoom", this.roomKey);
    });

    this.addPlayer({ x: 200, y: 200 });
  }

  addPlayer(playerInfo) {
    this.joined = true;
    this.player = new Aris(this, playerInfo.x, playerInfo.y);
  }

  update() {
    // CONTROL PANEL OVERLAP
    if (this.player) {
      this.physics.add.overlap(
        this.player,
        this.vendingMachine1,
        this.highlightControlPanel,
        null,
        this
      );
      //CONTROL PANEL: NOT OVERLAPPED
      this.checkOverlap(this.player, this.vendingMachine1);
    }
  }

  checkOverlap(player, vendingMachine) {
    const boundsPlayer = player.getBounds();
    const boundsPanel = vendingMachine.getBounds();
    if (
      !Phaser.Geom.Intersects.RectangleToRectangle(boundsPlayer, boundsPanel)
    ) {
      this.deactivateControlPanel(vendingMachine);
    }
  }

  highlightControlPanel(astronaut, controlPanel) {
    controlPanel.setTint(0xbdef83);
    controlPanel.setInteractive();
  }

  deactivateControlPanel(vendingMachine) {
    vendingMachine.clearTint();
    vendingMachine.disableInteractive();
  }
}

export default GameScene;
