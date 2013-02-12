define("Weapon", ["Activity"], function (Activity) {

	var defs = {};

	function define(def) {
		if (typeof def.id === "undefined") throw new Error("Weapon definition missing 'id'");
		if (typeof def.initial === "undefined") throw new Error("Weapon definition missing 'initial'");
		if (typeof def.max === "undefined") throw new Error("Weapon definition missing 'max'");
		if (typeof def.resupply === "undefined") throw new Error("Weapon definition missing 'resupply'");
		if (typeof def.inventorySprite === "undefined") throw new Error("Weapon definition missing 'inventorySprite'");
		if (defs[def.id]) throw new Error("Weapon '" + def.id + "' already defined");

		defs[def.id] = def;
	}

	function getInitialInventory() {
		var inv = {};

		_.each(defs, function (def) {
			inv[def.id] = def.initial;
		});

		return inv;
	}

	function trigger(id) {
		if (defs[id]) {
			Meteor.call("pushActivity", {
				module: "Weapon",
				data: id
			});
		} else {
			throw new Error("Invalid weapon type: " + id);
		}
	}

	function verifyActivity(activity, player) {
		var id = activity.data;
		if (player.dead) return false;
		if (defs[id].initial === -1) return true;
		if (player.inventory[id] > 0) return true;
		return false;
	}

	function processActivity(next) {
		var self = this;
		var player = Meteor.users.findOne({_id: self.userId});
		var inc = {};
		var id = self.data;

		if (typeof defs[id].sequence === "function") {
			defs[id].sequence.call(self, next);

			// Decrease inventory
			if (defs[id].resupply > 0) {
				inc["inventory." + id] = -1;
				Meteor.users.update({_id: self.userId}, {$inc: inc});
			}
		}
	}

	Meteor.startup(function () {

		// Control inventory resupply
		_.each(defs, function (def, id) {
			if (def.resupply > 0) {
				Meteor.setInterval(function () {
					var players = Meteor.users.find({idle: false, dead: false});
					players.forEach(function (player) {
						var inc = {};
						if (player.inventory[id] < def.max) {
							inc["inventory." + id] = 1;
							Meteor.users.update({_id: player._id}, {$inc: inc});
						}
					});
				}, def.resupply);
			}
		});

	});

	return {
		define: define,
		trigger: trigger,
		defs: defs,
		getInitialInventory: getInitialInventory,
		verifyActivity: verifyActivity,
		processActivity: processActivity
	};

});