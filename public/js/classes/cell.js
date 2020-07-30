export class Cell extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);
        this.height = 152;
        this.width = 152;
        this.graphics = scene.add.graphics();
        this.graphics.lineStyle(2, 0xffffff);
        this.graphics.strokeRect(-76, -76, 152, 152);
        this.add(this.graphics);
        this.card = null;
        this.setInteractive();
    }

    setPaw() {
        const paw = this.scene.add.sprite(0, 0, 'paw');
        this.add(paw);
    }

    setCard(card) {
        if (this.card) {
            this.remove(this.card);
        }
        this.card = card;
        if (card)
            this.add(card);

    }
}