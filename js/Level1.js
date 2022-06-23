class Level1{

    // Funcion donde se precargaran todos los assets de la escena.
    preload(){
        this.load.spritesheet("player", "images/player.png", 80, 80, 22)
        this.load.spritesheet("firebolt", "images/firebolt.png", 32, 17, 8)
    }

    // Funcion donde se creara el mundo: players, monedas, enemigos, etc
    create(){
        console.log("MOVER: Flechitas")
        console.log("Disparar: A")
        // Iniciar fisica tipo: Arcade (sin poligonos)
        this.physics.startSystem(Phaser.Physics.ARCADE)

        // Crear un jugador
        this.player = this.add.sprite(50, 50, "player", 8)

        // Crear movimiento del jugador por frame
        //this.player.animations.add(KEY, [FRAMES A USAR], VELOCIDAD DE REPETICION DE FRAMES, REPETIR INFINITAMENTE)
        this.player.animations.add("move-right", [6,7,8,9], 10, false)
        this.player.animations.add("move-left", [15,14,13,12], 10, false)
        this.player.animations.add("wait-right", [0,1,2], 10, true)
        this.player.animations.add("wait-left", [5,4,3], 10, true)
        this.player.animations.add("fire-right", [18,19,20,21], 10, false)
        this.player.animations.add("fire-left", [17,16,11,10], 10, false)
        this.physics.arcade.enable(this.player)
    }

    // Funcion de actualizacion constante, donde se establecen las funcionalidades en "real-time" del juego
    update(){

        // Realizar acciones al precionar teclas
        this.KEY_RIGHT = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT).isDown
        this.KEY_LEFT  = this.input.keyboard.addKey(Phaser.Keyboard.LEFT).isDown
        this.KEY_ATTACK  = this.input.keyboard.addKey(Phaser.Keyboard.A).isDown
        if(this.KEY_RIGHT){
            // Al precionar la flecha derecha: animamos al player y le damos una velocidad
            this.player.body.velocity.x = 50
            this.player.animations.play("move-right")
        }else if(this.KEY_LEFT){
            // Al precionar la flecha izquierda: animamos al player y le damos una velocidad
            this.player.body.velocity.x = -50
            this.player.animations.play("move-left")
        }else{
            // Al no tener ninguna tecla presionada:
            // * Detener movimiento
            // * Detener animaciones de caminar
            // * Comenzar animacion de "espera" segun el ultimo frame del jugador
            // * Si es frame 6, 7, 8 o 9, entonces estaba caminando a la derecha, por ende, animacion "wait-right"
            // * Si era frame: 12, 13, 14 o 15, entonces animacion "wait-left", porque estaba caminando a la izquierda
            this.player.body.velocity.x = 0
            this.player.animations.stop("move-left")
            this.player.animations.stop("move-right")

            // Verificar en que ultimo frame quedo segun a que lado estaba caminando el player
            switch(this.player.frame){
                case 6:
                case 7:
                case 8:
                case 9:
                    this.player.animations.play("wait-right")
                break
                case 12:
                case 13:
                case 14:
                case 15:
                    this.player.animations.play("wait-left")
                break
            }
        }

        if(this.KEY_ATTACK){
            switch(this.player.frame){
                case 6:
                case 7:
                case 8:
                case 9:
                case 0:
                case 1:
                case 2:
                    this.player.animations.play("fire-right").onComplete.add(() => {
                        let firebolt = this.add.sprite(this.player.position.x+50, this.player.position.y+30, "firebolt", 0)
                        firebolt.animations.add("fire", [0,1,2,3], 10, true)
                        this.physics.arcade.enable(firebolt)
                        firebolt.body.velocity.x = 150
                        firebolt.animations.play("fire")
                        this.player.animations.play("wait-right")
                    })
                break
                case 12:
                case 13:
                case 14:
                case 15:
                case 3:
                case 4:
                case 5:
                    this.player.animations.play("fire-left").onComplete.add(() => {
                        let firebolt = this.add.sprite(this.player.position.x, this.player.position.y+30, "firebolt", 0)
                        firebolt.animations.add("fire", [7,6,5,4], 10, true)
                        this.physics.arcade.enable(firebolt)
                        firebolt.body.velocity.x = -150
                        firebolt.animations.play("fire")
                        this.player.animations.play("wait-left")
                    })
                break
            }
        }
    }
}