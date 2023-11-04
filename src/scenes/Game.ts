import PhaserSceneTool from "./PhaserSceneTool"

class GameScene extends PhaserSceneTool {
  constructor() {
    super('GameScene');
  }

  create() {
    const logo = this.add.image(200, 70, 'interpretLogoWithCat');

    this.tweens.add({
      targets: logo,
      y: 350,
      duration: 1500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    });

    const logo2 = this.add.image(500, 170, 'interpretLogoWithCat');

    this.tweens.add({
      targets: logo2,
      y: 350,
      duration: 1500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }
}

export default GameScene