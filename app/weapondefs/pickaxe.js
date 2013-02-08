using("Weapon", "Map", "Player", "Sprite", function (Weapon, Map, Player, Sprite) {

	function pickaxe(offset, next) {
		var self = this;
		var pos = Player.getPosition(self.userId);
		var x = pos.x + offset.x;
		var y = pos.y + offset.y;

		var _setTimeout = Meteor.isClient ? window.setTimeout : Meteor.setTimeout;

		if (Meteor.isClient) {
			Map.layerAdd.call(self, Map.LAYER_WEAPONS, x, y, Sprite.Weapon.PICKAXE);
		} else {
			Map.layerAdd.call(self, Map.LAYER_DAMAGE, x, y, Sprite.Weapon.PICKAXE);
		}

		Map.layerAdd.call(self, Map.LAYER_LEVEL, x, y, " ");

		_setTimeout(function () {
			if (Meteor.isClient) {
				Map.layerSub.call(self, Map.LAYER_WEAPONS, x, y, Sprite.Weapon.PICKAXE);
			} else {
				Map.layerSub.call(self, Map.LAYER_DAMAGE, x, y, Sprite.Weapon.PICKAXE);
			}

			next();
		}, 50);
	}

	var options = {
		initial: -1,
		resupply: 0,
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