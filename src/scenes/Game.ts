import PhaserSceneTool from "./PhaserSceneTool";

import Aris from "../entities/Aris";

import ControlPanel from "../entities/ControlPanel";

import socketMixin from "../mixins/socketMixin";

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

    Object.assign(this, socketMixin);
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

    // SOCKET EVENTS
    this.setSocketEvents();
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
    this.checkoutVendingMachineOverlap();
  }

  checkoutVendingMachineOverlap() {
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
