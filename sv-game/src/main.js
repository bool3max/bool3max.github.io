import Phaser from './lib/phaser.js'
import TitleScreen from './scenes/TitleScreen.js'
import Game from './scenes/Game.js'

const gameConfig = {
    type: Phaser.AUTO,
    width: 720,
    height: 1440,
    backgroundColor: "#69b3f0",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0, x: 0},
            debug: false
        }
    },
    scene: [TitleScreen, Game]
}

const game = new Phaser.Game(gameConfig)

export default game