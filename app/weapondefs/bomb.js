using("Weapon", "Layers", "Player", "Sprite", function (Weapon, Layers, Player, Sprite) {

	var f1 = {
		x: 0,
		y: 0,
		m: "#"
	};

	var f2 = {
		x: -1,
		y: -1,
		m: 	"`#`\n" +
			"###\n" +
			"`#`"
	};

	var f3 = {
		x: -2,
		y: -2,
		m: 	"``#``\n" +
			"`###`\n" +
			"#####\n" +
			"`###`\n" +
			"``#``"
	};

	var f4 = {
		x: -3,
		y: -3,
		m: 	"```#```\n" +
			"``###``\n" +
			"`#####`\n" +
			"#######\n" +
			"`#####`\n" +
			"``###``\n" +
			"```#```"
	};

	var hole = f4.m.replace(new RegExp("#", "g"), " ");

	f1.explosion = f1.m.replace(new RegExp("#", "g"), Sprite.Weapon.EXPLOSION);
	f2.explosion = f2.m.replace(new RegExp("#", "g"), Sprite.Weapon.EXPLOSION);
	f3.explosion = f3.m.replace(new RegExp("#", "g"), Sprite.Weapon.EXPLOSION);
	f4.explosion = f4.m.replace(new RegExp("#", "g"), Sprite.Weapon.EXPLOSION);

	Weapon.define({
		id: "bomb",
		initial: 5,
		resupply: 5000,
		inventorySprite: Sprite.Weapon.BOMB,
		sequence: function (next) {
			var self = this;
			var pos = Player.getPosition(this.userId);
			var mapId = Player.getJoinedMapId(this.userId);
			var x = pos.x, y = pos.y;
			var _setTimeout = Meteor.isClient ? window.setTimeout : Meteor.setTimeout;

			_setTimeout(function () {
				if (Meteor.isClient) { Layers.add.call(self, Layers.WEAPONS, x + f1.x, y + f1.y, f1.explosion); }
				else { Layers.add.call(self, Layers.DAMAGE, x + f1.x, y + f1.y, f1.explosion, mapId); }

				if (Meteor.isServer) { Layers.add.call(self, Layers.OVERLAY, x + f4.x, y + f4.y, hole, mapId); }

				_setTimeout(function () {
					if (Meteor.isClient) { Layers.add.call(self, Layers.WEAPONS, x + f2.x, y + f2.y, f2.explosion); }
					else { Layers.add.call(self, Layers.DAMAGE, x + f2.x, y + f2.y, f2.explosion, mapId); }

					_setTimeout(function () {
						if (Meteor.isClient) { Layers.add.call(self, Layers.WEAPONS, x + f3.x, y + f3.y, f3.explosion); }
						else { Layers.add.call(self, Layers.DAMAGE, x + f3.x, y + f3.y, f3.explosion, mapId); }

						_setTimeout(function () {
							if (Meteor.isClient) { Layers.add.call(self, Layers.WEAPONS, x + f4.x, y + f4.y, f4.explosion); }
							else { Layers.add.call(self, Layers.DAMAGE, x + f4.x, y + f4.y, f4.explosion, mapId); }

							_setTimeout(function () {
								if (Meteor.isClient) { Layers.sub.call(self, Layers.WEAPONS, x + f4.x, y + f4.y, f4.explosion); }
								else { Layers.sub.call(self, Layers.DAMAGE, x + f4.x, y + f4.y, f4.explosion, mapId); }

								if (Meteor.isClient) { Layers.add.call(self, Layers.OVERLAY, x + f4.x, y + f4.y, hole); }

								next();
							}, 500);
						}, 40);
					}, 40);
				}, 40);
			}, 2000);
		}
	});

});