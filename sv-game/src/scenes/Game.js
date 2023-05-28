import Phaser from '../lib/phaser.js'
import * as helpers from '../lib/helpers.js'
import consts from '../consts.js'
//

export default class Game extends Phaser.Scene {
    // key:   phaser3 string key of image
    // value: base scale of image when at front
    trashItemsScales = {
        'trash-banana': 0.175,
        'trash-blackbag': 0.09,
        'trash-plasticbag': 0.15,
        'trash-trashcan': 0.25,
        'trash-waterbottle': 0.2,
        'trash-apple': 0.055,
        'trash-chips': 0.125,
        'trash-sodacan': 0.1,
        'trash-pizza': 0.05
    }

    trashItemPositions = [
        [250, 1400], [360, 1500], [365, 1550], [650, 1200], [630, 1150],
        [480, 1200], [130, 1150], [160, 1050], [200, 870], [320, 860],
        [420, 1120], [360, 1200], [420, 1000], [530, 1400], [330, 830],
        [310, 1140], [210, 1050], [50, 900], [500, 900], [650, 1300],
        [300, 930], [450, 1300], [330, 1000], [130, 900]
    ]

    // holds instances of image sprites
    trashItemsGround = [

    ]

    trashCollected = 0

    gameOver = false

    itemSpawnInterval = consts.INITIAL_ITEM_SPAWN_INTERVAL
    itemFallVelocity = consts.INITIAL_ITEM_FALL_VELOCITY

    constructor() {
        super('main-game')
    }

    init() {
        console.info(consts)

        this.gameOver = false
        this.trashItemsGround = []
        this.trashCollected = 0
        this.itemFallVelocity = consts.INITIAL_ITEM_FALL_VELOCITY
        this.itemSpawnInterval = consts.INITIAL_ITEM_SPAWN_INTERVAL
    }

    preload() {
        // background image
        this.backgroundImage = this.load.image('background-river', '../assets/river.png')

        // load individual images of items of trash
        this.load.image('trash-banana', '../assets/items_trash/banana_peel.png')
        this.load.image('trash-blackbag', '../assets/items_trash/black_trash_bag.png')
        this.load.image('trash-plasticbag', '../assets/items_trash/plastic_bag.png')
        this.load.image('trash-trashcan', '../assets/items_trash/trashcan.png')
        this.load.image('trash-waterbottle', '../assets/items_trash/water_bottle.png')
        this.load.image('trash-apple', '../assets/items_trash/apple.png')
        this.load.image('trash-chips', '../assets/items_trash/chips.png')
        this.load.image('trash-sodacan', '../assets/items_trash/sodacan.png')
        this.load.image('trash-pizza', '../assets/items_trash/pizza.png')

        // load the image of the player (recycle bin)
        this.load.image('recycle-bin', '../assets/recycle_bin.png')

        // audio
        this.load.audio('plop', '../assets/audio/plop.mp3')
        this.load.audio('gameover', '../assets/audio/gameover.mp3')
    }

    create() {
        this.audioPlop = this.sound.add('plop')
        this.audioGameOver = this.sound.add('gameover')

        this.backgroundImage = this.add.image(0, 0, 'background-river').setOrigin(0)
        this.titleText = this.add.text(this.scale.width / 2, 80, 'СКУПИ СМЕЋЕ!', helpers.defaultFont(90)).setOrigin(0.5)
        this.scoreText = this.add.text(this.scale.width / 2, 150, '0', {
            fontFamily: 'Rubik',
            fontSize: 70,
            color: "#55deed",
            shadow: {
                stroke: true,
                fill: true,
                blur: 9.0
            }
        })

        this.fillScene()

        // spawn the player
        this.bin = this.physics.add.sprite(this.scale.width / 2, -500, 'recycle-bin')
            .setScale(0.4)
        this.bin.y = (this.scale.height - this.bin.displayHeight / 2)
        this.bin.setCollideWorldBounds(true);
        this.bin.preFX.addShadow()

        this.trashItemsFloating = this.physics.add.group()
        this.trashSpawnTimer = this.time.addEvent({
            delay: this.itemSpawnInterval,
            callback: this.spawnTrashItem,
            callbackScope: this,
            loop: true
        })

        // touch input initialization
        this.input.addPointer(1)

        this.input.on('pointerdown', this.onTouchStart, this);
        this.input.on('pointerup', this.onTouchEnd, this);
        this.input.on('pointermove', this.onTouchMove, this);
    }

    update() {
        console.log(this.itemSpawnInterval);
        // move the player using the cursor keys on a keyboard
        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.left.isDown) {
            this.bin.setVelocityX(-consts.KEYBOARD_BIN_VELOCITY);
        } else if (cursors.right.isDown) {
            this.bin.setVelocityX(consts.KEYBOARD_BIN_VELOCITY);
        } else {
            if (this.bin.body.velocity.x > 0)  {
                this.bin.body.velocity.x -= consts.KEYBOARD_BIN_VELOCITY_CHANGE
            } else if (this.bin.body.velocity.x < 0) {
                this.bin.body.velocity.x += consts.KEYBOARD_BIN_VELOCITY_CHANGE
            }
        }

        this.physics.overlap(this.bin, this.trashItemsFloating, this.collectTrashItem, null, this)

        this.trashItemsFloating.getChildren().forEach(trashItem => {
            if (trashItem.y > this.scale.height + 100) {
                // item fell off-screen, played failed to pick up
                trashItem.destroy();

                if (this.trashCollected > 0) {
                    this.trashCollected--;   
                    this.updateScoreCounterText()
                }

                return;
            }

            trashItem.y += this.itemFallVelocity
        })

    }

    fillScene() {
        this.trashItemPositions.forEach(pos => {

            const randTrashItemKey = helpers.arrayRandom(Object.keys(this.trashItemsScales))
            const itemDistanceFromBottom = this.backgroundImage.height - pos[1];

            const trashItem = this.add.image(...pos, randTrashItemKey)
                .setScale(this.trashItemsScales[randTrashItemKey] * (1 - (itemDistanceFromBottom / this.backgroundImage.height) * 1.33))
                .setRotation(Phaser.Math.DegToRad(Phaser.Math.Between(-45, 45)))

            // shadows on each individual trash item are a no-no due to performance
            // trashItem.preFX.addShadow(0.5, 0.5, 0.1, 1.5, 0x0, 6, 1)

            this.trashItemsGround.push(trashItem)
        })
    } 

    spawnTrashItem() {
        const trashKey = helpers.arrayRandom(Object.keys(this.trashItemsScales))

        const newTrash = this.physics.add.sprite(
            -100,
            -100,
            trashKey
        ).setScale(this.trashItemsScales[trashKey] * 0.8)
        
        // newTrash.preFX.addGlow(0x5c5226, 4, 0, false, 0.1, 20)

        newTrash.x = Phaser.Math.Between(newTrash.displayWidth / 2 + 30, this.scale.width - newTrash.displayWidth / 2 - 30)

        this.trashItemsFloating.add(newTrash)
    }

    collectTrashItem(bin, trashItem) {
        // play sound effect
        this.audioPlop.play()

        // called when the player (recycle bin) and a piece of trash are colliding
        trashItem.destroy();

        // increase score, update counter
        this.trashCollected++;
        this.updateScoreCounterText()

        if (this.trashCollected % consts.COUNTER_MULTIPLIER_EFFECT === 0 && !this.gameOver) {
            // pick a random trash item from the ground
            const randTrashItemGround = helpers.arrayRandom(this.trashItemsGround);

            // remove it from the state array
            this.trashItemsGround.splice(this.trashItemsGround.indexOf(randTrashItemGround), 1)

            // destroy the phaser object of the item
            randTrashItemGround.destroy()

        
            // increase fall speed of items
            this.itemFallVelocity += consts.ITEM_FALL_VELOCITY_INCREASE;

            // update item spawn interval
            if (this.itemSpawnInterval - consts.ITEM_SPAWN_INTERVAL_DECREASE > 0) {
                // only decrease the interval if it will remain above zero
                this.itemSpawnInterval -= consts.ITEM_SPAWN_INTERVAL_DECREASE;
            }

            this.trashSpawnTimer.reset({
                delay: this.itemSpawnInterval,
                callback: this.spawnTrashItem,
                callbackScope: this,
                loop: true
            })

            if (this.trashItemsGround.length === 0) {
                this.gameOver = true
                this.time.addEvent({
                    delay: consts.GAME_OVER_DELAY,
                    callbackScope: this,
                    callback: this.onGameOver
                })
            }
        }
    }

    updateScoreCounterText() {
        this.scoreText.text = this.trashCollected;
        this.scoreText.originX = 0.5;
    }

    // touch pointer events

    onTouchStart() {
        this.isPlayerDragging = true;
    }

    onTouchEnd() {
        this.isPlayerDragging = false;
    }

    onTouchMove() {
        if (this.isPlayerDragging) {
            const touchX = this.input.activePointer.x;
            this.bin.x = Phaser.Math.Clamp(touchX, 0, this.scale.width);
        }
    }

    onGameOver() {
        console.info("GAME OVER")

        this.add.text(this.scale.width / 2, 380, 'Река успешно очишћена!', helpers.defaultFont(55))
        .setInteractive({ useHandCursor: true }).once('pointerdown', () => this.scene.start('title-screen'))
        .setOrigin(0.5).preFX.addGlow(0x2b6d9, 8, 0, false, 0.1, 30)

        this.audioGameOver.play()
    }
}