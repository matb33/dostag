using("Weapon", "Layers", "Player", "Sprite", function (Weapon, Layers, Player, Sprite) {

	// Disabling pickaxe, it causes severe lag when used frequently (possibly
	// too many diffs for the server to compute wrt to damage layer?)
	return;

	function pickaxe(offset, next) {
		var self = this;
		var pos = Player.getPosition(self.userId);
		var mapId = Player.getJoinedMapId(self.userId);
		var x = pos.x + offset.x;
		var y = pos.y + offset.y;

		var _setTimeout = Meteor.isClient ? window.setTimeout : Meteor.setTimeout;

		if (Meteor.isClient) {
			Layers.add.call(self, Layers.WEAPONS, x, y, Sprite.Weapon.PICKAXE);
		} else {
			Layers.add.call(self, Layers.DAMAGE, x, y, Sprite.Weapon.PICKAXE, mapId);
		}

		Layers.add.call(self, Layers.OVERLAY, x, y, " ", mapId);

		_setTimeout(function () {
			if (Meteor.isClient) {
				Layers.sub.call(self, Layers.WEAPONS, x, y, Sprite.Weapon.PICKAXE);
			} else {
				Layers.sub.call(self, Layers.DAMAGE, x, y, Sprite.Weapon.PICKAXE, mapId);
			}

			next();
		}, 50);
	}

	var options = {
		initial: -1,
		resupply: 0,
		max: -1,
		inventorySprite: Sprite.Weapon.PICKAXE
	};

	Weapon.define(_.extend({
		id: "pickaxe_u",
		sequence: function (next) {
			pickaxe.call(this, { x: 0, y: -1 }, next);
		}
	}, options));

	Weapon.define(_.extend({
		id: "pickaxe_d",
		sequence: function (next) {
			pickaxe.call(this, { x: 0, y: 1 }, next);
		}
	}, options));

	Weapon.define(_.extend({
		id: "pickaxe_l",
		sequence: function (next) {
			pickaxe.call(this, { x: -1, y: 0 }, next);
		}
	}, options));

	Weapon.define(_.extend({
		id: "pickaxe_r",
		sequence: function (next) {
			pickaxe.call(this, { x: 1, y: 0 }, next);
		}
	}, options));

});