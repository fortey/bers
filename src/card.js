const shortid = require('shortid');
const CardStore = require('./cardStore.js');

module.exports = class Card {
    constructor(data) {
        this.id = shortid.generate();
        this.key = data.key;
        const cardData = CardStore[data.key];
        for (let key in cardData) {
            this[key] = cardData[key];
        }
    }
}