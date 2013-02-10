using("Stats", "Sprite", function (Stats, Sprite) {

	Template.stats.playerCount = function () {
		return Stats.getPlayerCount();
	};

	Template.stats.playerSprite = function () {
		return Sprite.Player.OTHER;
	};

	Template.stats.inventory = function () {
		return Stats.getInventory();
	};

});