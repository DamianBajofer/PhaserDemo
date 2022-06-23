class Level1{

    // Funcion donde se precargaran todos los assets de la escena.
    preload(){
        this.load.image("Background", "images/bg.png");
        this.load.image("box", "images/box001.png");
        this.load.spritesheet("player", "images/player.png", 80, 80, 22)
        this.load.spritesheet("firebolt", "images/firebolt.png", 32, 17, 8)
    }

    // Funcion donde se creara el mundo: players, monedas, enemigos, etc
    create(){
        // Iniciar fisica tipo: Arcade (sin poligonos)
        this.physics.startSystem(Phaser.Physics.ARCADE)

        // Fondo del Juego
		this.background = this.add.tileSprite(0, 0, 2400, 650, "Background");

        // Dimension interna del canvas
        this.world.setBounds(0, 0, 2400, 650);

        // Plataforma Boxes
        this.Platforms = this.add.group()
        this.physics.arcade.enable(this.Platforms)
        console.log(this.Platforms)
        for(let i = 0; i < 48; i++){
            const box = this.Platforms.create((50*i), 600, "box")
            this.physics.arcade.enable(box)
            box.body.immovable = true
            box.body.moves = false
        }

        for(let i = 0; i < 6; i++){
            const box = this.Platforms.create((50*(i+10)), 500, "box")
            this.physics.arcade.enable(box)
            box.body.immovable = true
            box.body.moves = false
        }

        // Contiene todas las firebolts lanzadas por el personaje
        this.FireBolts = this.add.group()

        // Crear un jugador
        this.player = this.add.sprite(50, 450, "player", 8)
        this.physics.arcade.enable(this.player)
        this.player.body.collideWorldBounds = true
        this.player.body.gravity.y = 1500
        // Crear movimiento del jugador por frame
        //this.player.animations.add(KEY, [FRAMES A USAR], VELOCIDAD DE REPETICION DE FRAMES, REPETIR INFINITAMENTE)
        this.player.animations.add("move-right", [6,7,8,9], 10, false)
        this.player.animations.add("move-left", [15,14,13,12], 10, false)
        this.player.animations.add("wait-right", [0,1,2], 10, true)
        this.player.animations.add("wait-left", [5,4,3], 10, true)
        this.player.animations.add("fire-right", [18,19,20,21], 20, false)
        this.player.animations.add("fire-left", [17,16,11,10], 20, false)
        this.camera.follow(this.player)

        alert("MOVER: Flechitas\nDISPARO: A")
    }

    // Funcion de actualizacion constante, donde se establecen las funcionalidades en "real-time" del juego
    update(){

        // Establecer colisiones
        this.physics.arcade.collide(this.player, this.Platforms)

        // Realizar acciones al precionar teclas
        this.KEY_RIGHT = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT).isDown
        this.KEY_LEFT  = this.input.keyboard.addKey(Phaser.Keyboard.LEFT).isDown
        this.KEY_UP  = this.input.keyboard.addKey(Phaser.Keyboard.UP).isDown
        this.KEY_ATTACK  = this.input.keyboard.addKey(Phaser.Keyboard.A).isDown

        if(this.KEY_RIGHT){
            // Si se esta atacando ademas de caminar, entonces se ejecuta accion y animacion de ataque.
            if(this.KEY_ATTACK){
                if(this.player.side == "left"){
                    this.player.animations.play("fire-left").onComplete.add(this.CreateFireBolt, this)
                }else{
                    this.player.animations.play("fire-right").onComplete.add(this.CreateFireBolt, this)
                }
                // Si no se esta atacando, solo caminando, entonces accion y animacion de caminar.
            }else{
                // Al precionar la flecha derecha: animamos al player y le damos una velocidad
                this.player.body.velocity.x = 150
                this.player.animations.play("move-right")
                this.player.side = "right"
            }
        }else if(this.KEY_LEFT){
            // Si se esta atacando ademas de caminar, entonces se ejecuta accion y animacion de ataque.
            if(this.KEY_ATTACK){
                if(this.player.side == "left"){
                    this.player.animations.play("fire-left").onComplete.add(this.CreateFireBolt, this)
                }else{
                    this.player.animations.play("fire-right").onComplete.add(this.CreateFireBolt, this)
                }
                // Si no se esta atacando, solo caminando, entonces accion y animacion de caminar.
            }else{
                // Al precionar la flecha izquierda: animamos al player y le damos una velocidad
                this.player.body.velocity.x = -150
                this.player.animations.play("move-left")
                this.player.side = "left"
            }
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
                case 6: case 7: case 8: case 9:
                    this.player.animations.play("wait-right")
                break
                case 12: case 13: case 14: case 15:
                    this.player.animations.play("wait-left")
                break
            }
        }

        // Tecla de Salto "FLECHA ARRIBA"
        if(this.KEY_UP && this.player.body.touching.down){
            this.player.body.velocity.y = -600
        }

        // Tecla de ataque "A"
        if(this.KEY_ATTACK){
            if(this.player.side == "left"){
                this.player.animations.play("fire-left").onComplete.add(this.CreateFireBolt, this)
            }else{
                this.player.animations.play("fire-right").onComplete.add(this.CreateFireBolt, this)
            }
            // Verifica si ademas de atacar esta caminando
            if(this.KEY_RIGHT){
                this.player.body.velocity.x = 150
                this.player.side = "right"
            }
            if(this.KEY_LEFT){
                this.player.body.velocity.x = -150
                this.player.side = "left"
            }
        }
    }

    // Crea un firebolt en el grupo "FireBolts"
    CreateFireBolt(sprite, animation){
        let firebolt
        if(animation.name == "fire-right"){
            firebolt = this.FireBolts.create(this.player.position.x+50, this.player.position.y+30, "firebolt", 0)
            this.physics.arcade.enable(firebolt)
            firebolt.animations.add("fire", [0,1,2,3], 20, true)
            firebolt.animations.play("fire")
            firebolt.body.velocity.x = 500
            sprite.animations.play("wait-right")
        }else{
            firebolt = this.FireBolts.create(this.player.position.x, this.player.position.y+30, "firebolt", 0)
            this.physics.arcade.enable(firebolt)
            firebolt.animations.add("fire", [7,6,5,4], 20, true)
            firebolt.animations.play("fire")
            firebolt.body.velocity.x = -500
            sprite.animations.play("wait-left")
        }
        // Crea un tiempo para el firebolt creado para destruirla en 1000 milisegundos (1 segundo) despues de ser lanzada
        // Esto evita la acumulacion de sprites muertos en el juego para ahorrar y optimizar memoria ram.
        this.time.events.repeat(1000, 1, this.DestroyFireBolt, this, firebolt)
    }

    // Elimina el firebolt pasado determinado tiempo
    DestroyFireBolt(sprite){
        sprite.destroy()
        console.log("Firebolt destroyed!")
    }
}