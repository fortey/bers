
//var playerID = '';
export class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'Main'
        });
    }

    preload() {
    }

    create() {
        this.createSocket();
        const battleButton = this.add.text(30, 30, 'Battle', { color: "#df3508", fontSize: 90, backgroundColor: 'grey' });
        battleButton.setInteractive();
        battleButton.on('pointerdown', () => {
            this.socket.emit('createBattle');
            battleButton.setVisible(false);
            battleButton.setInteractive(false);
        });
    }
    createSocket() {
        this.socket = io();
        this.socket.on('register', (player) => this.playerID = player.id);
        this.socket.on('enterBattle', this.enterBattle.bind(this));
        this.socket.on('battleServer', (data) => this.events.emit('battleOn', data));
    }

    enterBattle(battleData) {
        battleData.playerID = this.playerID;
        this.scene.run('BattleScene', battleData);
        this.scene.get("BattleScene").events.on("battleEmit", this.battleEmit, this);
    }

    battleEmit(data) {
        this.socket.emit('battleClient', data);
    }

}