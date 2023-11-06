import PhaserSceneTool from "./PhaserSceneTool";

class TaskScene2 extends PhaserSceneTool {
  imageKey: string;

  constructor() {
    super("TaskScene2");

    this.imageKey = "seo2";
  }

  create() {
    this.add
      .image(this.gameWidth / 2, this.gameHeight / 2, this.imageKey)
      .setScale(0.5)
      .setDepth(0);

    this.input.on("pointerdown", () => {
      this.scene.switch("GameScene");
    });
  }
}

export default TaskScene2;
