class gameOver extends Phaser.Scene {
    constructor() {
        super();

    }

    init() {

    }

    preload() {
        this.load.audio('musica', '/audio/Game over screen.ogg');
        this.load.atlas('over', '/imgs/valorant-vergaderzaal-kingdom-come.png', '/imgs/valorant-vergaderzaal-kingdom-come.json');
    }

    create() {
        this.music = this.sound.add('musica');
        var musicConfig = {
            mute: false,
            volume: 0.5,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }
        this.music.play(musicConfig);
        this.anims.create({ key: 'skele', frames: this.anims.generateFrameNames('over', { prefix: 'valorant-vergaderzaal-kingdom-come', end: 149, zeroPad: 0, suffix: '.png' }), repeat: -1 });
        this.add.sprite(300, 300, 'over').play('skele');


    }


}

let config = {
    type: Phaser.AUTO,
    parent: 'fimDeJogo',
    width: 640,
    height: 512,
    scene: [gameOver]
};

let game = new Phaser.Game(config);
