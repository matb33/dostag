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

	Sprite.Weapon.EXPLOSION = "░";
	Sprite.Weapon.FIRE = "▒";
	Sprite.Weapon.BOMB = "δ";
	Sprite.Weapon.NAPALM = "ñ";
	Sprite.Weapon.PICKAXE = "τ";

	return Sprite;

});