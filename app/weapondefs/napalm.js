using("Weapon", "Map", "Player", "Sprite", function (Weapon, Map, Player, Sprite) {

	// Disabled... reaaaaaally slow
	return;

	function isTrue(value) {
		return value === true;
	}

	Weapon.define({
		id: "napalm",
		initial: 3,
		resupply: 10000,
		inventorySprite: Sprite.Weapon.NAPALM,
		sequence: function (next) {
			var self = this;
			var map = Map.getMapById(Player.getJoinedMapId(self.userId));
			var pos = Player.getPosition(self.userId);
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
					for (var d = 0; d < 4; d++) {
						if (!hold[d]) {
							switch (d) {
								case 0: y[d] -= 1; break;
								case 1: y[d] += 1; break;
								case 2: x[d] -= 1; break;
								case 3: x[d] += 1; break;
							}
							if (Map.isTraversable(map[Map.LAYER_LEVEL + y[d] + "_" + x[d]])) {
								if (step[d] === 1) {
									if (Meteor.isClient) { Map.layerAdd.call(self, Map.LAYER_WEAPONS, x[d], y[d], Sprite.Weapon.FIRE); }
									else { Map.layerAdd.call(self, Map.LAYER_DAMAGE, x[d], y[d], Sprite.Weapon.FIRE); }
								} else {
									if (Meteor.isClient) { Map.layerSub.call(self, Map.LAYER_WEAPONS, x[d], y[d], Sprite.Weapon.FIRE); }
									else { Map.layerSub.call(self, Map.LAYER_DAMAGE, x[d], y[d], Sprite.Weapon.FIRE); }
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