import Player from "./Player";

class Momoi extends Player {
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, "momoi");
  }
}

export default Momoi;
