import Phaser from 'phaser';
import config from './config';

import PreloadLogo from './scenes/PreloadLogo';
import Preload from './scenes/Preload';
import GameScene from './scenes/Game';

new Phaser.Game(
  Object.assign(config, {
    scene: [
      PreloadLogo,
      Preload,
      GameScene
    ]
  })
);
