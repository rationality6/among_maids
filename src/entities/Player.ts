class Player extends Phaser.Physics.Arcade.Sprite {
  speed: any = 225;
  cursors;

  playerId: string;

  constructor(scene: any, x: number, y: number, key: string) {
    super(scene, x, y, key);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setScale(0.13);

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

    this.setCollideWorldBounds(true);

    this.init();
  }

  init() {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  update() {
    if (!this || !this.body) {
      return;
    }

    this.body.setVelocity(0);

    // Horizental movement
    if (this.cursors.left.isDown) {
      this.scene.player.setVelocityX(-this.speed);
      this.scene.player.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.scene.player.setVelocityX(this.speed);
      this.scene.player.setFlipX(false);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.scene.player.setVelocityY(-this.speed);
    } else if (this.cursors.down.isDown) {
      this.scene.player.setVelocityY(this.speed);
    }

    // // Normalize and scale the velocity so that astronaut can't move faster along a diagonal
    this.body.velocity.normalize().scale(this.speed);

    // emit player movement
    let x = this.scene.player.x;
    let y = this.scene.player.y;
    if (
      this.scene.player.oldPosition &&
      (x !== this.scene.player.oldPosition.x ||
        y !== this.scene.player.oldPosition.y)
    ) {
      this.scene.socket.emit("playerMovement", {
        x: this.scene.player.x,
        y: this.scene.player.y,
        roomKey: this.scene.roomKey,
      });
    }
    // save old position data
    this.scene.player.oldPosition = {
      x: this.scene.player.x,
      y: this.scene.player.y,
      rotation: this.scene.player.rotation,
    };
  }
}

export default Player;
