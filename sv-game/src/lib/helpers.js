function logVariousSizes(scene) {
    console.log("scene.width, scene.height =", scene.scale.width, scene.scale.height)
    console.log("scene.gameSize.width, scene.gameSize.height =", scene.scale.gameSize.width, scene.scale.gameSize.height)
}

function arrayRandom(arr) {
    return arr[Math.floor((Math.random() * arr.length))];
}

const defaultFont = (fontSize) => {
    return {
        fontFamily: "Rubik",
        shadow: {
            stroke: true,
            fill: true,
            blur: 9.0
        },
        fontSize
    }
}

export {
    logVariousSizes,
    arrayRandom,
    defaultFont
}