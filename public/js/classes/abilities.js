export class Ability {

};

export class SimplePunch {
    constructor(damage) {
        this.damage = damage;
    }

    toString() {
        return `Удар ${this.damage[0]}-${this.damage[1]}-${this.damage[2]}`;
    }
    targets(source, cards, cardsID) {
        return cardsID.filter((cardID, index, arr) => {
            Math.abs(source.pos.x - cards[cardID].pos.x) < 2 && Math.abs(source.pos.y - cards[cardID].pos.y) < 2;
        });
    }
}
