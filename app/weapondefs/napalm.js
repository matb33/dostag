using("Weapon", "Map", "Damager", "Sprites", function (Weapon, Map, Damager, Sprites) {

	// NOTE: This weapon definition is a work in progress. It's currently waaaaay too CPU intensive.

	Weapon.define("napalm", function (grid, ox, oy, setTimeout, clearTimeout, setInterval, clearInterval) {
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
				if (Map.isTraversable(grid[that.y + "_" + that.x])) {
					if (that.mode === 0) {
						Map.addOverlay.call(self, that.x, that.y, Sprites.Weapon.NAPALM);
					} else {
						Map.subOverlay.call(self, that.x, that.y, Sprites.Weapon.NAPALM);
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
			var up = new Spread(1, 50);
			var down = new Spread(2, 50);
			var left = new Spread(3, 50);
			var right = new Spread(4, 50);
		}, 2000);
	});

});