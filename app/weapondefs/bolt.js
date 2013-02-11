using("Weapon", "Map", "Player", "Sprite", "Layers", function (Weapon, Map, Player, Sprite, Layers) {

	function isFalse(value) {
		return value === false;
	}

	Weapon.define({
		id: "bolt",
		initial: 0,
		max: 1,
		resupply: 30000,
		inventorySprite: Sprite.Weapon.BOLT,
		sequence: function (next) {
			var self = this;
			var mapId = Player.getJoinedMapId(self.userId);
			var map = Map.getMapById(mapId);
			var pos = Player.getPosition(self.userId);
			var overlay = Layers.getDocument(Layers.OVERLAY, mapId);
			var _setTimeout = Meteor.isClient ? window.setTimeout : Meteor.setTimeout;

			var x = [], y = [], count = [], hold = [];
			var wx, wy, ox, oy, d, safe = 0;
			var weaponPath = {}, weaponSubPath = {}, overlayPath = {};

			var destroyInitial = 1;

			function traversable(x, y) {
				var key = y + "_" + x;
				var targetChar = overlay && overlay[key] !== null ? overlay[key] : map.level[key];
				return Map.traversable(targetChar);
			}

			function addWeaponPath(x, y) {
				var key = y + "_" + x;
				weaponPath[key] = Sprite.Weapon.BOLT;
				weaponSubPath[key] = null;
				wx = (wx === undefined || x < wx) ? x : wx;
				wy = (wy === undefined || y < wy) ? y : wy;
			}

			function addOverlayPath(x, y) {
				var key = y + "_" + x;
				overlayPath[key] = " ";
				ox = (ox === undefined || x < ox) ? x : ox;
				oy = (oy === undefined || y < oy) ? y : oy;
			}

			for (d = 0; d < 4; d++) {
				x[d] = pos.x;
				y[d] = pos.y;
				count[d] = 0;
				hold[d] = false;
			}

			// Determine bolt paths. The first X chars are skipped when
			// determining when to stop because those are destroyed
			while(_.some(hold, isFalse)) {
				for (d = 0; d < 4; d++) {
					if (!hold[d]) {
						count[d]++;

						switch (d) {
							case 0: y[d] -= 1; break;
							case 1: y[d] += 1; break;
							case 2: x[d] -= 1; break;
							case 3: x[d] += 1; break;
						}

						key = y[d] + "_" + x[d];

						if (count[d] <= destroyInitial) {
							// First X chars destroy and aren't stopped by walls
							addWeaponPath(x[d], y[d]);
							addOverlayPath(x[d], y[d]);
						} else {
							// Subsequent chars are stopped by walls and thus don't
							// add to the overlay
							if (traversable(x[d], y[d])) {
								addWeaponPath(x[d], y[d]);
							} else {
								hold[d] = true;
							}
						}
					}
				}
				if (safe++ > 5000) break;
			}

			_setTimeout(function () {
				// Apply various bolt paths
				if (Meteor.isClient) {
					Layers.add.call(self, Layers.WEAPONS, wx, wy, weaponPath);
				} else {
					// Add to damage layer, but remove right away on next tick
					Layers.add.call(self, Layers.DAMAGE, wx, wy, weaponPath, mapId);
					_setTimeout(function () {
						Layers.sub.call(self, Layers.DAMAGE, wx, wy, weaponSubPath, mapId);
					}, 0);
				}

				Layers.add.call(self, Layers.OVERLAY, ox, oy, overlayPath, mapId);

				_setTimeout(function () {
					if (Meteor.isClient) {
						Layers.sub.call(self, Layers.WEAPONS, wx, wy, weaponSubPath);
					}
				}, 200);
			}, 0);
		}
	});

});