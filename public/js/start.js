import { BootScene } from './scenes/boot.js';
import { BattleScene } from './scenes/battle.js';
import { MainScene } from './scenes/main.js';

var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 1480,
    height: 960,
    zoom: 1,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false // set to true to view zones
        }
    },
    scene: [
        BootScene,
        BattleScene,
        MainScene,
    ]
};
var game = new Phaser.Game(config);