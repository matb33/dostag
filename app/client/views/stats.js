using("Stats", "Sprite", function (Stats, Sprite) {

	Template.stats.playerCount = function () {
		return Stats.getPlayerCount();
	};

	Template.stats.playerKills = function () {
		return Stats.getKills();
	};

	Template.stats.killsSprite = function () {
		return Sprite.Player.DEAD;
	};

	Template.stats.inventory = function () {
		return Stats.getInventory();
	};

});