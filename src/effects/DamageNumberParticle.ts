class DamageNumberParticle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, damage) {
    super(scene, x, y, "damageNumberParticle");

    this.damage = damage;

    this.text = this.scene.add.text(x, y, damage, {
      fontSize: "20px",
      color: "#ffffff",
    });

    setTimeout(() => {
      this.text.destroy();
    }, 1000);

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update(time, delta) {
    this.text.y = this.text.y - 1;
  }
}

export default DamageNumberParticle;
