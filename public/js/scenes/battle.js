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

    init({ id, state, playerID, decks, endTime }) {
        this.id = id;
        this.state = state;
        this.playerID = playerID;
        this.endTime = endTime;
        // this.players = data.players;
        // this.boardData = data.board;
        // this.cardsData = data.cards;
        this.cards = [];
        // this.playerIndex = this.players.indexOf(data.playerID);
        // this.action = null;
        this.decks = decks;
        this.paws = [];
        this.firstTurn = true;
        this.commands = [];
        this.commands['startDrawing'] = this.startDrawing.bind(this);
        this.commands['startBattle'] = this.startBattle.bind(this);
        this.commands['moveCardComplete'] = this.moveCardComplete.bind(this); console.log(cardStore['arb'].abilities);
    }
    preload() { }

    create() {
        this.scene.get("Main").events.on("battleOn", this.battleOn, this);
        this.createDeckList();
        this.drawBoard();
        this.nextButton = this.add.text(1200, 500, 'Далее', { color: 'white', fontSize: 30, fontStyle: 'bold', backgroundColor: 'grey' });
        this.nextButton.visible = false;
        this.timer = this.add.text(1200, 100);
    }

    update() {
        this.timer.setText((this.endTime - Date.now()).toString().substr(0, 3));
    }
    initCards(cardsData) {
        cardsData.forEach(cardData => {
            const card = new Card(this, cardStore[cardData.key]);
            card.setOwner(cardData.owner);
            card.id = cardData.id;
            this.cards[cardData.id] = card;
        });
    }

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
        //console.log(`cellPointerDown: ${row} - ${col}`);
        if (!this.action || this.action == 'selectCard') {
            const card = this.board[row][col].card;
            if (card) {
                if (this.selectdCard) {
                    if (this.selectdCard == card) return;
                    this.deletePaws();
                }
                this.action = 'selectCard';
                this.selectdCard = card;
                if (this.selectdCard.canMove())
                    this.showPaws(row, col);
                this.showCardActions(card);

            } else if (this.action == 'selectCard') {
                if (this.paws.indexOf(this.board[row][col]) != -1) {
                    this.battleEmit({ action: 'moveCard', card: this.selectdCard.id, row: row, col: col });
                    console.log({ action: 'moveCard', card: this.selectdCard.id, row: row, col: col });
                }
                else {
                    this.deletePaws();
                    this.clearCardActions();
                    this.action = null;
                    this.selectdCard = null;
                }
            }
        }
    }

    showPaws(row, col) {
        if (row > 0) {
            if (this.board[row - 1][col].setPaw())
                this.paws.push(this.board[row - 1][col]);
        };
        if (row < 5) {
            if (this.board[row + 1][col].setPaw())
                this.paws.push(this.board[row + 1][col]);
        };
        if (col > 0) {
            if (this.board[row][col - 1].setPaw())
                this.paws.push(this.board[row][col - 1]);
        };
        if (col < 4) {
            if (this.board[row][col + 1].setPaw())
                this.paws.push(this.board[row][col + 1]);
        };
    }
    deletePaws() {
        this.paws.forEach(cell => cell.deletePaw());
        this.paws = [];
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
            this.battleEmit({ action: 'selectDeck', deckID: deckItem.id })
        );
    }

    battleOn(data) {
        console.log('battle on');
        console.log(data);

        const command = this.commands[data.action];
        if (command) {
            command(data);
        }
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

    startDrawing({ hand }) {
        this.deckList.forEach(el => el.destroy());
        this.board.forEach(row => row.forEach(cell => {
            if (cell.card) {
                cell.card.destroy();
                cell.card = null;
            }
            cell.setVisible(false);
        }));

        this.createHandCells();
        this.createBottomCells();
        this.fillHand(hand);
        this.createDragEvents();

        this.nextButton.removeAllListeners('pointerdown');
        this.nextButton.on('pointerdown', this.completeDrawing.bind(this));
    }

    createHandCells() {
        this.hand = [];
        const startX = this.boardLeftX + 76;
        for (let row = 0; row < 3; row++) {
            this.hand[row] = [];
            for (let col = 0; col < 5; col++) {
                this.hand[row][col] = new Cell(this, col * 155 + startX, row * 155 + 78);
            }
        }
    }

    createBottomCells() {
        this.bottomBoard = [];
        const startX = this.boardLeftX + 76;
        const offsetY = 3 * 155 + 85;
        for (let row = 0; row < 3; row++) {
            this.bottomBoard[row] = [];
            for (let col = 0; col < 5; col++) {
                this.bottomBoard[row][col] = new Cell(this, col * 155 + startX, row * 155 + offsetY);
                if (col > 0 && col < 4) this.bottomBoard[row][col].setAvailable();
            }
        }
    }

    fillHand(hand) {
        for (let i = 0; i < hand.length; i++) {
            const row = Math.trunc(i / 5);
            const col = i % 5;
            const card = new Card(this, cardStore[hand[i].key]);
            card.id = hand[i].id;
            card.setDraggable();
            this.hand[row][col].setCard(card);
        }
    }

    createDragEvents() {
        this.input.on('dragstart', (pointer, gameObject) => {
            this.startPositon = { x: gameObject.x, y: gameObject.y };
            gameObject.depth = 2;
        });
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.depth = 1;
            const x = gameObject.x - this.boardLeftX - 1;
            const y = gameObject.y - 3 * 155 - 10;
            if (x > 0 && x < 155 * 5 && y > 0 && y < 3 * 155) {
                const col = Math.trunc(x / 155);
                const row = Math.trunc(y / 155);
                const cell = this.bottomBoard[row][col];
                if (cell && cell.isAvailable && !cell.card) {
                    gameObject.cell.card = null;
                    cell.setCard(gameObject);
                }
                else {
                    gameObject.x = this.startPositon.x;
                    gameObject.y = this.startPositon.y;
                }
            }
            else {
                gameObject.x = this.startPositon.x;
                gameObject.y = this.startPositon.y;
            }
        });
    }

    completeDrawing() {
        const halfOfBoard = this.bottomBoard.map((row, indexRow, rows) => row.map((cell, index, row) => cell.card?.id ?? null));
        this.battleEmit({ action: 'completeDrawing', halfOfBoard: halfOfBoard })
    }

    startBattle({ board, cards }) {
        this.hand.forEach(row => row.forEach(cell => {
            if (cell.card) {
                cell.card.destroy();
                cell.card = null;
            }
            cell.destroy();
        }));
        this.bottomBoard.forEach(row => row.forEach(cell => {
            if (cell.card) {
                cell.card.destroy();
                cell.card = null;
            }
            cell.destroy();
        }));
        this.nextButton.destroy();

        this.initCards(cards);

        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 5; col++) {
                this.board[row][col].setVisible(true);
                const cardID = board[row][col];
                if (cardID) {
                    this.board[row][col].setCard(this.cards[cardID]);
                }
                this.board[row][col].on('pointerdown', () => this.cellPointerDown(row, col));
            }
        }
    }

    moveCardComplete({ card, row, col, oldPos }) {
        this.board[oldPos.y][oldPos.x].card = null;
        this.board[row][col].setCard(this.cards[card]);
        this.cards[card].paws--;
        this.deletePaws();
        this.selectdCard = null;
        this.cellPointerDown(row, col);
    }

    showCardActions(card) {
        this.clearCardActions();
        this.cardActions = [];
        card.abilities.forEach((ability, index, arr) => {
            let action = this.add.text(1200, 900 - 50 * index, ability.toString(), { color: 'white', fontStyle: 'bold', backgroundColor: 'grey' });
            action.setInteractive();
            action.on('pointerdown', () => console.log(ability.toString()));
            this.cardActions.push(action);
        });
    }
    clearCardActions() {
        if (this.cardActions) {
            this.cardActions.forEach((action, index, arr) => action.destroy());
        }
    }
}

