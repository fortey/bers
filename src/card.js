const shortid = require('shortid');

module.exports = class Card {
    constructor(data) {
        this.id = shortid.generate();
        this.key = data.key;
    }
}