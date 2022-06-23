// Iniciamos el sistema del juego
let Game = new Phaser.Game(1200, 650, Phaser.Canvas)

// Creamos todas las escenas del juego
Game.state.add("Level1", Level1)

// Cargamos la escena inicial del juego por defecto
Game.state.start("Level1")