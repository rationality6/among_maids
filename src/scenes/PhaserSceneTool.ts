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

  get isLocal() {
    return location.hostname === "localhost" ||
      location.hostname === "127.0.0.1"
      ? true
      : false;
  }

  setDelay(time: number) {
    return new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
      }, time)
    );
  }
}

export default PhaserSceneTool;
