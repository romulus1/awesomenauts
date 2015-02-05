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
        
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 123, 124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);

        this.renderable.setCurrentAnimation("idle");
    },
    
    update: function(delta) {
        if (me.input.isKeyPressed("right")) {
            //adds to the position of my x by the velocity defined above in setVelocity() 
            //and multiplying it by me.timer.tick
            //me.timer.tick makes the movement look smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.flipX(true);
        } else {
            this.body.vel.x = 0;//makes velocity zero
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

        else if (this.body.vel.x !== 0) {
            if (!this.renderable.isCurrentAnimation("walk")) {  //if it is walk, it sets it to walk
                this.renderable.setCurrentAnimation("walk");
            }
        } else {
            this.renderable.setCurrentAnimation("idle");
        }

        if (me.input.isKeyPressed("attack")) {
            if (!this.renderable.isCurrentAnimation("attack")) {
                console.log(!this.renderable.isCurrentAnimation("attack"));
                //sets the current animation to attack and once that is over, goes back to the idle animation 
                this.renderable.setCurrentAnimation("attack", "idle");
                //Makes it so that the next time that we will start this sequence we begin from the first animation, not where ever we left off when we switched to another animation
                this.renderable.setAnimationFrame();
            }
        }

        this.body.update(delta);  //updates the isKeyPressed()

        this._super(me.Entity, "update", [delta]);
        return true;

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
                    return (new me.Rect(0, 0, 100, 100)).toPolygon();
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
                    return (new me.Rect(0, 0, 100, 100)).toPolygon();
                }

            }]);
        this.broken = false;
        this.health = 10;
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

    }

});
