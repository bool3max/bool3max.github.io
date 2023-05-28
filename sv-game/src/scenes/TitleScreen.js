import Phaser from '../lib/phaser.js'
import * as helpers from '../lib/helpers.js'

export default class TitleScreen extends Phaser.Scene {
    constructor() {
        super('title-screen')
    }

    preload() {
        this.load.svg('sv-logo', '../assets/logo_sv.svg')
        this.load.image('ui-right-arrow', '../assets/ui-btn-arrow-right.png')
        this.load.image('background', '../assets/background_titlescreen.png')
    }

    create() {
        this.add.image(360, 720, 'background')
        const btnNext = this.add.image(this.scale.width / 2, this.scale.height * 0.6, 'ui-right-arrow')
                        .setScale(0.25)

        btnNext.preFX.addShadow(-1, -1.5, 0.05, 0.5, 0x0, 6, 0.8)
        btnNext.setInteractive({ useHandCursor: true }).once('pointerdown', () => this.scene.start('main-game'))

        const logoSv = this.add.image(this.scale.width / 2, this.scale.height * 0.33, 'sv-logo')
                       .setScale(1.5)
        
        logoSv.preFX.addShadow(-1, -1.5, 0.05, 0.5, 0x0, 6, 0.8)
        const gameTitleText = this.add.text(this.scale.width / 2, this.scale.height * 0.45, 'Очисти реку', helpers.defaultFont(85)).setOrigin(0.5, 0.33)

        this.add.text(this.scale.width / 2, this.scale.height - 35, "© ЈВП \"Србијаводе\" 2023.", helpers.defaultFont(20)).setOrigin(0.5)
    }
}