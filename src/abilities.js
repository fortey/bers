exports.SimplePunch = class SimplePunch {
    constructor(damage) {
        this.damage = damage;
    }

    targetIsValid(source, target) {
        return Math.abs(source.pos.x - target.pos.x) < 2 && Math.abs(source.pos.y - target.pos.y) < 2;
    }

    isAvailable(card, battle) {
        return !card.isTurned && battle.currentPlayer == card.owner;
    }

    isValid(card, target, battle) {
        return this.isAvailable(card, battle) && this.targetIsValid(card, target);
    }
}
