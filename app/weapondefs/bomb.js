using("Weapon", "Map", "Damager", "Sprites", function (Weapon, Map, Damager, Sprites) {

	var f1 = {
		x: 0,
		y: 0,
		t: "#"
	};

	var f2 = {
		x: -1,
		y: -1,
		t: 	" # \n" +
			"###\n" +
			" # "
	};

	var f3 = {
		x: -2,
		y: -2,
		t: 	"  #  \n" +
			" ### \n" +
			"#####\n" +
			" ### \n" +
			"  #  "
	};

	var f4 = {
		x: -3,
		y: -3,
		t: 	"   #   \n" +
			"  ###  \n" +
			" ##### \n" +
			"#######\n" +
			" ##### \n" +
			"  ###  \n" +
			"   #   "
	};

	f1.t = f1.t.replace(new RegExp("#", "g"), Sprites.Weapon.EXPLOSION);
	f2.t = f2.t.replace(new RegExp("#", "g"), Sprites.Weapon.EXPLOSION);
	f3.t = f3.t.replace(new RegExp("#", "g"), Sprites.Weapon.EXPLOSION);
	f4.t = f4.t.replace(new RegExp("#", "g"), Sprites.Weapon.EXPLOSION);

	Weapon.define("bomb", function (grid, ox, oy, setTimeout, clearTimeout, setInterval, clearInterval) {
		var self = this;

		setTimeout(function () {
			Map.addOverlay.call(self, ox + f1.x, oy + f1.y, f1.t);
			Damager.add.call(self, ox + f1.x, oy + f1.y, f1.t);

			setTimeout(function () {
				Map.addOverlay.call(self, ox + f2.x, oy + f2.y, f2.t);
				Damager.add.call(self, ox + f2.x, oy + f2.y, f2.t);

				setTimeout(function () {
					Map.addOverlay.call(self, ox + f3.x, oy + f3.y, f3.t);
					Damager.add.call(self, ox + f3.x, oy + f3.y, f3.t);

					setTimeout(function () {
						Map.addOverlay.call(self, ox + f4.x, oy + f4.y, f4.t);
						Damager.add.call(self, ox + f4.x, oy + f4.y, f4.t);

						setTimeout(function () {
							Map.subOverlay.call(self, ox + f4.x, oy + f4.y, f4.t);
							Damager.sub.call(self, ox + f4.x, oy + f4.y, f4.t);
						}, 500);
					}, 40);
				}, 40);
			}, 40);
		}, 2000);
	});

});