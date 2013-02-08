using("Weapon", "Map", "Damager", "Sprite", function (Weapon, Map, Damager, Sprite) {

	// NOTE: This weapon definition is a work in progress. It's currently
	// far too chatty and causes major slowdowns
	return;

	Weapon.define("napalm", 3, 10000, Sprite.Weapon.NAPALM, function (map, ox, oy, setTimeout, clearTimeout, setInterval, clearInterval) {
		var self = this;

		function Spread(direction, speed) {
			var that = this;

			that.x = ox;
			that.y = oy;
			that.mode = 0;

			that.intervalId = setInterval(function () {
				switch (direction) {
					case 1: that.y -= 1; break;
					case 2: that.y += 1; break;
					case 3: that.x -= 1; break;
					case 4: that.x += 1; break;
				}
				if (Map.isTraversable(map.level[that.y + "_" + that.x])) {
					if (that.mode === 0) {
						Map.layerAdd.call(self, "weapons", that.x, that.y, Sprite.Weapon.FIRE);
						Damager.add(self, that.x, that.y, Sprite.Weapon.FIRE);
					} else {
						Map.layerSub.call(self, "weapons", that.x, that.y, Sprite.Weapon.FIRE);
						Damager.sub(self, that.x, that.y, Sprite.Weapon.FIRE);
					}
				} else {
					if (that.mode === 0) {
						that.x = ox;
						that.y = oy;
						that.mode = 1;
					} else {
						clearInterval(that.intervalId);
					}
				}
			}, speed);
		}

		setTimeout(function () {
			new Spread(1, 50);
			new Spread(2, 50);
			new Spread(3, 50);
			new Spread(4, 50);
		}, 2000);
	});

});