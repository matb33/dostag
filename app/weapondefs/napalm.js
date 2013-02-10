using("Weapon", "Map", "Player", "Sprite", "Layers", function (Weapon, Map, Player, Sprite, Layers) {

	// Disabled... too slow
	return;

	function isTrue(value) {
		return value === true;
	}

	Weapon.define({
		id: "napalm",
		initial: 3,
		max: 3,
		resupply: 10000,
		inventorySprite: Sprite.Weapon.NAPALM,
		sequence: function (next) {
			var self = this;
			var mapId = Player.getJoinedMapId(self.userId);
			var map = Map.getMapById(mapId);
			var pos = Player.getPosition(self.userId);
			var overlay = Layers.getDocument(Layers.OVERLAY, mapId);
			var _setTimeout = Meteor.isClient ? window.setTimeout : Meteor.setTimeout;
			var _setInterval = Meteor.isClient ? window.setInterval : Meteor.setInterval;
			var _clearInterval = Meteor.isClient ? window.clearInterval : Meteor.clearInterval;

			function start(speed) {
				var x = [], y = [], step = [], hold = [];
				var intervalId;

				function reset() {
					for (var d = 0; d < 4; d++) {
						x[d] = pos.x;
						y[d] = pos.y + (d === 0 ? 1 : 0);
						step[d] = (step[d] || 0) + 1;
						hold[d] = false;
					}
				}

				reset();

				intervalId = _setInterval(function () {
					var key, targetChar;

					for (var d = 0; d < 4; d++) {
						if (!hold[d]) {
							switch (d) {
								case 0: y[d] -= 1; break;
								case 1: y[d] += 1; break;
								case 2: x[d] -= 1; break;
								case 3: x[d] += 1; break;
							}

							key = y[d] + "_" + x[d];
							targetChar = overlay[key] !== null ? overlay[key] : map.level[key];

							if (Map.isTraversable(targetChar)) {
								if (step[d] === 1) {
									if (Meteor.isClient) { Layers.add.call(self, Layers.WEAPONS, x[d], y[d], Sprite.Weapon.FIRE); }
									else { Layers.add.call(self, Layers.DAMAGE, x[d], y[d], Sprite.Weapon.FIRE, mapId); }
								} else {
									if (Meteor.isClient) { Layers.sub.call(self, Layers.WEAPONS, x[d], y[d], Sprite.Weapon.FIRE); }
									else { Layers.sub.call(self, Layers.DAMAGE, x[d], y[d], Sprite.Weapon.FIRE, mapId); }
								}
							} else {
								hold[d] = true;
								if (step[d] === 1) {
									if (_.all(hold, isTrue)) {
										reset();
									}
								} else {
									if (_.all(hold, isTrue)) {
										_clearInterval(intervalId);
										next();
									}
								}
							}
						}
					}
				}, speed);
			}

			_setTimeout(function () {
				start(150);
			}, 2000);
		}
	});

});