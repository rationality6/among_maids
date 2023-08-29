class PhaserSceneTool extends Phaser.Scene {
  get gameHeight() {
    return this.game.config.height as number;
  }

  get gameWidth() {
    return this.game.config.width as number;
  }

  constructor(key: string) {
    super(key);
  }
}

export default PhaserSceneTool;
