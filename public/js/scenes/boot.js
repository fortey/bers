export class BootScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'BootScene'
        });
    }

    preload() {

        // this.load.tilemapTiledJSON('map', 'assets/ground/map.json');
        this.load.image('paw', 'assets/paw.png');
        this.load.image('crossbowman', 'assets/crossbowman.png');
        this.load.spritesheet('m-cards', 'assets/cards.png', { frameWidth: 150, frameHeight: 150 });

        // // enemies
        // this.load.image("dragonblue", "assets/sprites/dragonblue.png");
        // this.load.image("dragonorrange", "assets/sprites/dragonorrange.png");

        // // our two characters
        // this.load.spritesheet('player', 'assets/sprites/healer_f.png', { frameWidth: 32, frameHeight: 36 });

        // this.load.image("arrow", "assets/sprites/arrow.png");


    }

    create() {
        this.scene.start('Main');
    }
}