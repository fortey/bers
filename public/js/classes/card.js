export class Card extends Phaser.GameObjects.Container {
    constructor(scene, cardData) {
        super(scene, 0, 0);
        scene.add.existing(this);
        this.height = 152;
        this.width = 152;

        this.sprite = scene.add.sprite(0, 0, 'm-cards', cardData.frame);
        this.add(this.sprite);
        this.key = cardData.key;
    }

    setOwner(owner) {
        this.owner = owner;
        const color = this.scene.playerIndex === owner ? 0x0000ff : 0xff0000f;
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(2, color);
        graphics.strokeRect(-76, -76, 152, 152);
        this.add(graphics);
    }
    setCounter(count) {
        if (count > 1) {
            this.add(this.scene.add.text(55, -75, count, { color: 'blue', fontSize: 30, fontStyle: 'bold', strokeThickness: 2 }));
        }
    }

    setDraggable() {
        this.setInteractive();
        this.scene.input.setDraggable(this);
    }
}