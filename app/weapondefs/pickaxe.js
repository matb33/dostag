using("Weapon", "Map", "Damager", "Sprites", function (Weapon, Map, Damager, Sprites) {

	function pickaxe(grid, ox, oy, setTimeout, clearTimeout, setInterval, clearInterval, offset) {
		var self = this;
		var x = ox + offset.x;
		var y = oy + offset.y;

		Map.addOverlay.call(self, x, y, Sprites.Weapon.PICKAXE);
		Map.replace.call(self, x, y, " ");
		Damager.add.call(self, x, y, Sprites.Weapon.PICKAXE);

		setTimeout(function () {
			Map.subOverlay.call(self, x, y, Sprites.Weapon.PICKAXE);
			Damager.sub.call(self, x, y, Sprites.Weapon.PICKAXE);
		}, 50);
	}

	Weapon.define("pickaxe_u", function () {
		pickaxe.apply(this, Array.prototype.slice.call(arguments).concat([{ x: 0, y: -1 }]));
	});

	Weapon.define("pickaxe_d", function () {
		pickaxe.apply(this, Array.prototype.slice.call(arguments).concat([{ x: 0, y: 1 }]));
	});

	Weapon.define("pickaxe_l", function () {
		pickaxe.apply(this, Array.prototype.slice.call(arguments).concat([{ x: -1, y: 0 }]));
	});

	Weapon.define("pickaxe_r", function () {
		pickaxe.apply(this, Array.prototype.slice.call(arguments).concat([{ x: 1, y: 0 }]));
	});

});