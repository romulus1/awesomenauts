game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	mfe: function() {
		// reset the score
		game.data.score = 0;
                me.levelDirector.loadLevel("level01"); //Loads our map 
                
                var player = me.pool.pull("player", 0, 420, {});
                me.game.world.addChild(player, 5);
                
                me.input.bindKey(me.input.KEY.RIGHT, "right");
                me.input.bindkey(me.input.KEY.A, "attack");
                
		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	}
});
