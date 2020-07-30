const shortid = require('shortid');

const testDecks = require('./testDecks.js');

module.exports = class Battle {
    constructor() {
        this.id = shortid.generate();
        this.players = [];
        this.postmans = [];
        this.decks = [];
        this.board = [
            [null, null, 'e', null, null],
            [null, 'b', null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null]];
        this.cards = [
            { id: 'e', key: '1', owner: 1 },
            { id: 'b', key: '1', owner: 0 }];
    }

    messageOn(message, playerID) {
        if (message.action == 'selectDeck') {

        }
    }

    startDrawing(deckID, playerID) {
        const deck = testDecks[deckID];
        this.decks[playerID] = deck.cards;
    }


}