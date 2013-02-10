define("Sprite", function () {

	var Sprite = {
		Map: {},
		Player: {},
		Weapon: {}
	};

	Sprite.Map.OOB = "·";
	Sprite.Map.TRANSPARENT = "`";

	Sprite.Player.YOU = "☻";
	Sprite.Player.OTHER = "☺";
	Sprite.Player.DEAD = "☠";

	Sprite.Weapon.EXPLOSION = "░";
	Sprite.Weapon.FIRE = "▒";
	Sprite.Weapon.BOMB = "☌";
	Sprite.Weapon.NAPALM = "☢";
	Sprite.Weapon.PICKAXE = "τ";
	Sprite.Weapon.BOLT = "⚡";

	return Sprite;

});