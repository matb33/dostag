define("Sprite", function () {

	var Sprite = {
		Map: {},
		Player: {},
		Weapon: {}
	};

	Sprite.Map.OOB = "·";
	Sprite.Map.TRANSPARENT = "`";
	Sprite.Map.METAL_FULL = "█";
	Sprite.Map.METAL_BOTTOM = "▄";
	Sprite.Map.METAL_TOP = "▀";
	Sprite.Map.METAL_LEFT = "▌";
	Sprite.Map.METAL_RIGHT = "▐";

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