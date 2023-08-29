import PhaserSceneTool from "./PhaserSceneTool"

class GameScene extends PhaserSceneTool {
  constructor() {
    super('GameScene');
  }

  create() {
    const logo = this.add.image(400, 70, 'interpretLogoWithCat');

    this.tweens.add({
      targets: logo,
      y: 350,
      duration: 1500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }
}

export default GameScene