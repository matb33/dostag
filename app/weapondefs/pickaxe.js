using("Weapon", "Map", "Damager", "Sprite", function (Weapon, Map, Damager, Sprite) {

	function pickaxe(map, ox, oy, setTimeout, clearTimeout, setInterval, clearInterval, offset) {
		var self = this;
		var x = ox + offset.x;
		var y = oy + offset.y;

		Map.layerAdd.call(self, "weapons", x, y, Sprite.Weapon.PICKAXE);
		Map.layerAdd.call(self, "level", x, y, " ");
		Damager.add.call(self, x, y, Sprite.Weapon.PICKAXE);

		setTimeout(function () {
			Map.layerSub.call(self, "weapons", x, y, Sprite.Weapon.PICKAXE);
			Damager.sub.call(self, x, y, Sprite.Weapon.PICKAXE);
		}, 50);
	}

	Weapon.define("pickaxe_u", -1, 0, Sprite.Weapon.PICKAXE, function () {
		pickaxe.apply(this, Array.prototype.slice.call(arguments).concat([{ x: 0, y: -1 }]));
	});

	Weapon.define("pickaxe_d", -1, 0, Sprite.Weapon.PICKAXE, function () {
		pickaxe.apply(this, Array.prototype.slice.call(arguments).concat([{ x: 0, y: 1 }]));
	});

	Weapon.define("pickaxe_l", -1, 0, Sprite.Weapon.PICKAXE, function () {
		pickaxe.apply(this, Array.prototype.slice.call(arguments).concat([{ x: -1, y: 0 }]));
	});

	Weapon.define("pickaxe_r", -1, 0, Sprite.Weapon.PICKAXE, function () {
		pickaxe.apply(this, Array.prototype.slice.call(arguments).concat([{ x: 1, y: 0 }]));
	});

});