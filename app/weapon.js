define("Weapon", ["Map", "Player"], function (Map, Player) {

	var weapons = {};

	function define(id, initial, resupply, sprite, sequence) {
		weapons[id] = {
			initial: initial,
			resupply: resupply,
			sprite: sprite,
			sequence: sequence
		}
	}

	Meteor.methods({
		triggerWeapon: function (id) {
			var mapId = Player.getJoinedMapId(this.userId);
			var map = Map.getMapById(mapId);
			var pos = Player.getPosition();

			if (weapons[id]) {
				if (typeof weapons[id].sequence === "function") {
					weapons[id].sequence.call(this, map, pos.x, pos.y,
						this.isSimulation ? setTimeout : Meteor.setTimeout,
						this.isSimulation ? clearTimeout : Meteor.clearTimeout,
						this.isSimulation ? setInterval : Meteor.setInterval,
						this.isSimulation ? clearInterval : Meteor.clearInterval
					);
				} else {
					throw new Error("Missing weapon sequence function: " + id);
				}
			} else {
				throw new Error("Invalid weapon type: " + id);
			}
		}
	});

	return {
		define: define,
		defs: weapons
	};

});