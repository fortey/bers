
//var playerID = '';
export class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'Main'
        });
        this.buttons = [];
        this.isActive = true;
    }

    preload() {
    }

    create() {
        this.createSocket();
        this.createBattleButton();

    }
    createSocket() {
        this.socket = io();
        this.socket.on('register', (player) => this.playerID = player.id);
        this.socket.on('battles', this.createBattleList.bind(this));
        this.socket.on('enterBattle', this.enterBattle.bind(this));
        this.socket.on('battleServer', (data) => this.events.emit('battleOn', data));
    }

    enterBattle(battleData) {
        this.isActive = false;
        battleData.playerID = this.playerID;
        this.buttons.forEach(button => button.destroy());
        this.battleButton.destroy();
        this.scene.run('BattleScene', battleData);
        this.scene.get("BattleScene").events.on("battleEmit", this.battleEmit, this);
    }

    battleEmit(data) {
        this.socket.emit('battleClient', data);
    }

    createBattleList(battles) {
        if (this.isActive)
            for (let i in battles) {
                const players = battles[i].players;
                if (players.length == 2) {
                    const text = `${players[0].name} - ${players[1].name}`;
                    this.buttons.push(this.add.text(30, 50 + 40 * i, text, { color: "#df3508", fontSize: 30, backgroundColor: 'grey' }));
                }
                if (players.length == 1) {
                    const text = `${players[0].name} - Принять вызов`;
                    const battleButton = this.add.text(30, 50 + 40 * i, text, { color: "#df3508", fontSize: 30, backgroundColor: 'grey' });
                    battleButton.setInteractive();
                    battleButton.on('pointerdown', () => {
                        this.socket.emit('joinBattle', battles[i].id);
                    });
                    this.buttons.push(battleButton);
                }
            }
    }

    createBattleButton() {
        const battleButton = this.add.text(30, 10, 'Создать', { color: "#df3508", fontSize: 30, backgroundColor: 'grey' });
        battleButton.setInteractive();
        battleButton.on('pointerdown', () => {
            this.socket.emit('createBattle');
            battleButton.setText('Cancel');
            battleButton.removeAllListeners('pointerdown');
            battleButton.on('pointerdown', () => {
                this.socket.emit('cancelBattle');
            });
        });
        this.battleButton = battleButton;
    }

}