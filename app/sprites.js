define("Sprites", function () {

	var Sprites = {
		Map: {},
		Player: {},
		Weapon: {}
	};

	Sprites.Map.OOB = "·";

	Sprites.Player.YOU = "☻";
	Sprites.Player.OTHER = "☺";

	Sprites.Weapon.EXPLOSION = "░";
	Sprites.Weapon.NAPALM = "▒";
	Sprites.Weapon.PICKAXE = "τ";

	return Sprites;

});