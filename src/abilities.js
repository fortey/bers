class Ability {
    constructor() {
        this.attackNames = ['слабый', 'средний', 'сильный'];
    }
    throwDice() {
        return Math.floor(Math.random() * 6) + 1
    }
}

exports.SimplePunch = class SimplePunch extends Ability {
    constructor(damage) {
        super();
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

    attackCalculation(attackDice, defendDice) {
        let attack = null
        let defend = null
        if (defendDice === null) {
            if (attackDice < 4) attack = 0;
            else if (attackDice < 6) attack = 1;
            else attack = 2;
        }
        else if (attackDice > defendDice) {
            switch (attackDice - defendDice) {
                case 1:
                    attack = 0;
                    break;
                case 2:
                    attack = 1;
                    defend = 0;
                    break;
                case 3:
                    attack = 1;
                    break;
                case 4:
                    attack = 2;
                    defend = 0;
                    break;
                default:
                    attack = 2;
            }
        }
        else if (attackDice < defendDice) {
            switch (defendDice - attackDice) {
                case 1:
                    attack = 0;
                    break;
                case 2:
                    break;
                case 3:
                    defend = 0;
                    break;
                case 4:
                    attack = 0;
                    defend = 1;
                    break;
                default:
                    defend = 1;
            }
        }
        else {
            if (attackDice < 5) attack = 0
            else defend = 0;
        }
        return { attack, defend }
    }

    action(source, target) {
        let result = ''

        const attackDice = this.throwDice();
        result += `'${source.name}' кидает кубик на ${attackDice}.\n`;
        const defendDice = target.isTurned ? null : this.throwDice();
        if (defendDice !== null) result += `'${target.name}' кидает кубик на ${defendDice}.\n`;

        const { attack, defend } = this.attackCalculation(attackDice, defendDice);
        if (attack === null) {
            result += `'${source.name}' промахивается.\n`;
        }
        else {
            const wounds = this.damage[attack];
            target.wounds += wounds;
            result += `'${owner.name}' нанес '${target.name}' ${this.attackNames[attack]} удар (${wounds} ран).\n`;
            if (target.wounds >= target.health + target.additionalHealth) {
                // todo card is dead
                result += `'${target.name}' погибает\n`;
            }
        }

        if (defend !== null) {
            const ability = target.abilities.find(ability => ability instanceof SimplePunch);
            if (ability) {
                const wounds = ability.damage[defend];
                source.wounds += wounds;
                result += `'${target.name}' нанес '${source.name}' ${this.attackNames[defend]} удар (${wounds} ран).\n`;
                if (source.wounds >= source.health + source.additionalHealth) {
                    // todo card is dead
                    result += `'${source.name}' погибает\n`;
                }
            }
        }

        source.isTurned = true;
        return result;
    }
}
