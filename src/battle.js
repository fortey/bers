const shortid = require('shortid');

const testDecks = require('./testDecks.js');
const Card = require('./card.js');

module.exports = class Battle {
    constructor() {
        this.id = shortid.generate();
        this.state = 'selectDeck';
        this.firstPlayer = null;
        this.players = [];
        this.postmans = [];
        this.decks = [];
        this.hands = [];
        this.cardsID = [];
        this.board = [
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null]];
        this.cards = [];
        this.enterCallbacks = [];

        this.commands = [];
        this.commands['selectDeck'] = this.startDrawing.bind(this);
        this.commands['completeDrawing'] = this.completeDrawing.bind(this);
        this.commands['moveCard'] = this.moveCard.bind(this);
    }

    messageOn(message, playerID) {
        const command = this.commands[message.action];
        if (command) {
            command(message, playerID);
        }
    }

    addPlayer(playerID, playerPostman) {
        this.players.push(playerID);
        this.postmans[playerID] = playerPostman; //console.log('addpla',)
        if (this.players.length == 1) this.start();// later 2
    }

    start() {
        this.startTime = Date.now();
        this.selectDeckTime = 120;
        this.enterCallbacks.forEach(callback => callback({ id: this.id, decks: testDecks, endTime: this.startTime + this.selectDeckTime * 1000 }));
    }

    startDrawing({ deckID }, playerID) {
        this.setFirstPlayer();
        const deck = testDecks.find(el => el.id == deckID);
        this.decks[playerID] = this.initDeck(deck.cards, playerID);
        this.hands[playerID] = this.cardsInHand(this.decks[playerID]);
        this.postmans[playerID]({ action: 'startDrawing', hand: this.hands[playerID] });
        this.state = 'drawing';
    }

    cardsInHand(cards) {
        const hand = [];
        const deckLength = cards.length;
        const userNumbers = [];
        for (let i = 0; i < 15; i++) {
            const r = this.getRandom(deckLength, userNumbers);
            userNumbers.push(r);
            hand.push({ id: cards[r], key: this.cards[cards[r]].key });
        }
        return hand;
    }

    initDeck(cards, playerID) {
        const deck = [];
        cards.forEach(cardData => {
            for (let i = 0; i < cardData.count; i++) {
                const card = new Card(cardData);
                card.owner = playerID;
                deck.push(card.id);
                this.cards[card.id] = card;
                this.cardsID.push(card.id);
            }
        });
        return deck;
    }

    getRandom(max, usedNumbers) {
        if (max < 30) return 0;
        while (true) {
            const num = Math.floor(Math.random() * max);
            if (usedNumbers.indexOf(num) === -1) return num;
        }
    }

    completeDrawing({ halfOfBoard }, playerID) {
        if (this.state == 'drawing') {// todo: проверка расстановки
            console.log(`${this.firstPlayer} - ${playerID}`);
            if (this.firstPlayer === playerID) {
                for (let row = 0; row < 3; row++) {
                    for (let col = 0; col < 5; col++) {
                        this.board[row + 3][col] = halfOfBoard[row][col];
                    }
                }
            } else {
                for (let row = 0; row < 3; row++) {
                    for (let col = 0; col < 5; col++) {
                        this.board[2 - 1 * row][4 - 1 * col] = halfOfBoard[row][col]; // переворачивается поле 2го игрока
                    }
                }
            }
        }
        this.addTestPlayer();
        this.state = 'startBattle';
        const cards = this.cardsID.map((cardID, ind, arr) => ({ id: cardID, key: this.cards[cardID].key, owner: this.cards[cardID].owner }));
        this.postmans[playerID]({ action: 'startBattle', board: this.board, cards: cards });
    }

    setFirstPlayer() {
        if (!this.firstPlayer)
            this.firstPlayer = this.players[0];
    }

    moveCard({ card, row, col }, playerID) {
        const cardOb = this.cards[card];
        if (!cardOb || cardOb.owner != playerID || cardOb.paws == 0) return;
        let pos = this.cardPosition(card);
        if (pos && !this.board[row][col] && (Math.abs(pos.x - col) == 1 && pos.y == row || Math.abs(pos.y - row) == 1 && pos.x == col)) {
            this.board[pos.y][pos.x] = null;
            this.board[row][col] = card;
            cardOb.paws--;
            this.players.forEach(player => this.postmans[player]({ action: 'moveCardComplete', card, row, col, oldPos: pos }));
        }
    }

    cardPosition(cardID) {
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 5; col++) {
                if (this.board[row][col] == cardID)
                    return { y: row, x: col };
            }
        }
    }

    addTestPlayer() {
        const playerID = 'test';
        this.addPlayer(playerID, (data) => { });
        const deck = testDecks.find(el => el.id == 'Starter');
        this.decks[playerID] = this.initDeck(deck.cards, playerID);
        this.board[2][2] = this.decks[playerID][0];
    }
}