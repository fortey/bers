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
        if (!this.card) {
            const paw = this.scene.add.sprite(0, 0, 'paw');
            this.add(paw);
            this.paw = paw;
            return true;
        }
        return false;
    }

    deletePaw() {
        if (this.paw) {
            this.paw.destroy();
            this.paw = null;
        }
    }

    setCard(card) {
        if (this.card) {
            this.card.destroy();
        }
        this.card = card;
        if (card) {
            card.x = this.x;
            card.y = this.y;
            card.setVisible(true);
            card.cell = this;
        }
    }

    setAvailable() {
        this.isAvailable = true;
        const g = this.scene.add.graphics();
        g.fillStyle(0xffffff, 0.3);
        g.fillRect(-75, -75, 150, 150);
        this.add(g);
    }
}