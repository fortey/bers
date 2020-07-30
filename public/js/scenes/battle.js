import { Cell } from '../classes/cell.js';
import { cardStore } from '../cardStore.js';
import { Card } from '../classes/card.js';
import { DeckItem } from '../classes/deckItem.js';

export class BattleScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'BattleScene'
        });
        this.boardLeftX = 350;

    }

    init(data) {
        console.log(data);
        this.id = data.id;
        // this.players = data.players;
        // this.boardData = data.board;
        // this.cardsData = data.cards;
        // this.cards = [];
        // this.playerIndex = this.players.indexOf(data.playerID);
        // this.action = null;
        this.decks = data.decks;
    }
    preload() { }

    create() {
        this.scene.get("Main").events.on("battleOn", this.battleOn, this);
        //this.initCards();
        //this.drawBoard(this.boardData);
        this.createDeckList();
        this.drawBoard();
        this.nextButton = this.add.text(1200, 500, 'Далее', { color: 'white', fontSize: 30, fontStyle: 'bold', backgroundColor: 'grey' });
        this.nextButton.visible = false;
    }

    initCards() {
        this.cardsData.forEach(cardData => {
            const card = new Card(this, cardStore[cardData.key]);
            card.setOwner(cardData.owner);
            this.cards[cardData.id] = card;
        });
    }
    // drawBoard(board) {

    //     for (let row = 0; row < 6; row++) {
    //         this.board[row] = [];
    //         for (let col = 0; col < 5; col++) {
    //             const cell = new Cell(this, col, row);
    //             this.board[row][col] = cell;
    //             const cardId = board[row][col];
    //             if (cardId) {
    //                 cell.setCard(this.cards[cardId]);
    //                 //cell.card = this.cards[cardId];
    //             }
    //             cell.on('pointerdown', () => this.cellPointerDown(row, col));
    //         }
    //     }
    // }

    drawBoard() {
        this.board = [];
        const startX = this.boardLeftX + 76;
        for (let row = 0; row < 6; row++) {
            this.board[row] = [];
            for (let col = 0; col < 5; col++) {
                this.board[row][col] = new Cell(this, col * 155 + startX, row * 155 + 78);
            }
        }
    }

    cellPointerDown(row, col) {
        console.log(`cellPointerDown: ${row} - ${col}`);
        if (!this.action) {
            this.action = 'selectCard';
            this.showPaws(row, col);
        }
    }
    showPaws(row, col) {
        if (row > 0) {
            this.board[row - 1][col].setPaw();
        }
    }

    createDeckList() {
        this.deckList = [];
        let y = 10;
        this.decks.forEach(deck => {
            this.deckList.push(new DeckItem(this, 10, y, deck));
            y = +30;
        });

    }

    changeDeck(deckItem) {
        if (this.currentDeck) this.currentDeck.deselect();
        this.currentDeck = deckItem;
        this.showDeckCards(deckItem.id);
        this.nextButton.setInteractive();
        this.nextButton.visible = true;
        this.nextButton.removeAllListeners('pointerdown');
        this.nextButton.on('pointerdown', () =>
            this.battleEmit({ action: 'selectDeck', deckId: deckItem.id })
        );
    }

    battleOn(data) {
        console.log('battle on');
        console.log(data);
    }
    battleEmit(data) {
        this.events.emit('battleEmit', data);
    }
    showDeckCards(deckId) {
        const cards = this.decks.find(d => d.id === deckId).cards;
        let i = 0; console.log(cards.length);
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 5; col++) {
                if (i >= cards.length)
                    this.board[row][col].setCard(null);
                else {
                    const card = new Card(this, cardStore[cards[i].key]);
                    this.board[row][col].setCard(card);
                    card.setCounter(cards[i].count);
                }
                i++;
            }
        }
    }

}

