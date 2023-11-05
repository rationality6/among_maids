class Player extends Phaser.Physics.Arcade.Sprite {
  speed: any = 225;

  constructor(scene: any, x: number, y: number, key: string) {
    super(scene, x, y, key);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setScale(0.13);

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update() {
    this.body.setVelocity(0);

    if (this.scene.cursors.left.isDown) {
      this.body.setVelocityX(-this.speed);
      this.setFlipX(true);
    } else if (this.scene.cursors.right.isDown) {
      this.body.setVelocityX(this.speed);
      this.setFlipX(false);
    }
    // Vertical movement
    if (this.scene.cursors.up.isDown) {
      this.body.setVelocityY(-this.speed);
    } else if (this.scene.cursors.down.isDown) {
      this.body.setVelocityY(this.speed);
    }

    // Normalize and scale the velocity so that astronaut can't move faster along a diagonal
    this.body.velocity.normalize().scale(this.speed);
  }
}

export default Player;
