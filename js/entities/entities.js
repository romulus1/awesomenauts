game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                //makes the sprite work
                image: "player",
                width: 64,
                height: 64,
                spritewidth: "64",
                spritheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon(); //zeros are top corners and the two sixty fours are the width and the height
                }
            }]);
        
        this.body.setVelocity(5, 20);  //sets the velocity for the key binded
        //Keeps track of which direction your character is going
        this.facing = "right";
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastAttack = new Date().getTime();
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 123, 124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
        this.renderable.addAnimation("left", [82, 83, 84, 85, 86, 87, 88, 89, 90], 80);

        this.renderable.setCurrentAnimation("idle");
    },
    
    update: function(delta) {
        this.now = new Date().getTime();
        if (me.input.isKeyPressed("right")) {
            //adds to the position of my x by the velocity defined above in setVelocity() 
            //and multiplying it by me.timer.tick
            //me.timer.tick makes the movement look smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            this.flipX(true);
        }else if (me.input.isKeyPressed("left")) {
            //adds to the position of my x by the velocity defined above in setVelocity() 
            //and multiplying it by me.timer.tick
            //me.timer.tick makes the movement look smooth
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.facing = "left";
            this.flipX(false); //makes the sprite flip
        }else {
            this.body.vel.x = 0;//makes velocity zero
        }
        
        if(me.input.isKeyPressed("jump") && !this.jumping && !this.falling){
            me.jumping = true;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        }

        //two of the attack if/else makes the animation smoother
        if (me.input.isKeyPressed("attack")) {
            if (!this.renderable.isCurrentAnimation("attack")) {
                console.log(!this.renderable.isCurrentAnimation("attack"));
                //sets the current animation to attack and once that is over, goes back to the idle animation 
                this.renderable.setCurrentAnimation("attack", "idle");
                //Makes it so that the next time that we will start this sequence we begin from the first animation
                // not where ever we left off when we switched to another animation
                this.renderable.setAnimationFrame();
            }
        }

        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {  //if it is walk, it sets it to walk
                this.renderable.setCurrentAnimation("walk");
            }
        } else if(!this.renderable.isCurrentAnimation("attack")){
            this.renderable.setCurrentAnimation("idle");
        }
        
        me.collision.check(this, true, this.collideHandler.bind(this), true); //passes a parameter
        this.body.update(delta);  //updates the isKeyPressed()

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    collideHandler: function(response) { //this is the parameter it's passing. 
        if(response.b.type==='EnemyBaseEntity'){ //It's used to collide with the tower without using the meta tiles(faulty)
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;
            
            //console.log("xdif " + xdif + " ydif " + ydif);
            
            if(ydif<-40 && xdif< 70 && xdif>-35){
                this.body.falling = false;
                this.body.vel.y = -1;
            }
            else if(xdif>-35 && this.facing==='right' && xdif<0){ //
                this.body.vel.x = 0; //
                this.pos.x = this.pos.x-1; //
            } else if(xdif<70 && this.facing==='left' && xdif>0){
                this.body.vel.x = 0;
                this.pos.x = this.pos.x +1;
            }
            
            if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= 1000){
                console.log("tower hit");
                this.lastHit = this.now;
                response.b.loseHealth();
            }
        }
    }

});

game.PlayerBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spritheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon();
                }

            }]);
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);

        this.type = "PlayerBaseEntity";
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");

    },
    
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.rendreable.setCurrentAnimation("broken");
        }
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    onCollision: function() {

    }

});

game.EnemyBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: 100,
                spritheight: 100,
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon(); //makes the towers postion
                }

            }]);
        this.broken = false;
        this.health = 1;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);

        this.type = "EnemyBaseEntity";
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);//this holds the animation to be used later
        this.renderable.setCurrentAnimation("idle");//renderable is a class in melon js that helps us in animating the character

    },
    
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("idle");
        }
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    onCollision: function() {

    },
    
    loseHealth: function(){
        this.health--;
    }

});
