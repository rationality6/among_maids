import Phaser from 'phaser';
import config from './config';

import GameScene from './scenes/Game';
import Preload from './scenes/Preload';

new Phaser.Game(
  Object.assign(config, {
    scene: [
      Preload,
      GameScene
    ]
  })
);
