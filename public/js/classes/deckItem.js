export class DeckItem extends Phaser.GameObjects.Text {
    constructor(scene, x, y, deck) {
        super(scene, x, y, deck.name, { color: 'white', fontSize: 30 });
        this.id = deck.id;
        scene.add.existing(this);
        this.setInteractive();
        this.on('pointerdown', () => {
            scene.changeDeck(this);
            this.select();
        })
    }
    select() {
        this.setColor("#f8ff38");
    }

    deselect() {
        this.setColor('white');
    }
}