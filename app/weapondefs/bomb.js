using("Weapon", "Layers", "Player", "Sprite", function (Weapon, Layers, Player, Sprite) {

	var f1 = {
		x: 0,
		y: 0,
		m: "#"
	};

	var f2 = {
		x: -2,
		y: -2,
		m: 	"``#``\n" +
			"`###`\n" +
			"#####\n" +
			"`###`\n" +
			"``#``"
	};

	var f3 = {
		x: -4,
		y: -4,
		m: 	"````#````\n" +
			"```###```\n" +
			"``#####``\n" +
			"`#######`\n" +
			"#########\n" +
			"`#######`\n" +
			"``#####``\n" +
			"```###```\n" +
			"````#````"
	};

	var hole = f3.m.replace(new RegExp("#", "g"), " ");

	f1.explosion = f1.m.replace(new RegExp("#", "g"), Sprite.Weapon.EXPLOSION);
	f2.explosion = f2.m.replace(new RegExp("#", "g"), Sprite.Weapon.EXPLOSION);
	f3.explosion = f3.m.replace(new RegExp("#", "g"), Sprite.Weapon.EXPLOSION);

	Weapon.define({
		id: "bomb",
		initial: 5,
		max: 5,
		resupply: 5000,
		inventorySprite: Sprite.Weapon.BOMB,
		sequence: function (next) {
			var self = this;
			var pos = Player.getPosition(this.userId);
			var mapId = Player.getJoinedMapId(this.userId);
			var x = pos.x, y = pos.y;
			var _setTimeout = Meteor.isClient ? window.setTimeout : Meteor.setTimeout;

			_setTimeout(function () {
				if (Meteor.isServer) {
					// Reduce chatter by setting damage right away, and not incrementally for each frame
					Layers.add.call(self, Layers.OVERLAY, x + f3.x, y + f3.y, hole, mapId);
					Layers.add.call(self, Layers.DAMAGE, x + f3.x, y + f3.y, f3.explosion, mapId);

					// Control removal of damage layer separately. Make it "instant", but wrap it in
					// a setTimeout so that it has time to take effect
					_setTimeout(function () {
						Layers.sub.call(self, Layers.DAMAGE, x + f3.x, y + f3.y, f3.explosion, mapId);
					}, 0);
				}

				if (Meteor.isClient) {
					Layers.add.call(self, Layers.WEAPONS, x + f1.x, y + f1.y, f1.explosion);
				}

				_setTimeout(function () {
					if (Meteor.isClient) {
						Layers.add.call(self, Layers.WEAPONS, x + f2.x, y + f2.y, f2.explosion);
					}

					_setTimeout(function () {
						if (Meteor.isClient) {
							Layers.add.call(self, Layers.WEAPONS, x + f3.x, y + f3.y, f3.explosion);
						}

						_setTimeout(function () {
							if (Meteor.isClient) {
								Layers.sub.call(self, Layers.WEAPONS, x + f3.x, y + f3.y, f3.explosion);
								Layers.add.call(self, Layers.OVERLAY, x + f3.x, y + f3.y, hole);
							}

							next();
						}, 500);
					}, 40);
				}, 40);
			}, 2000);
		}
	});

});