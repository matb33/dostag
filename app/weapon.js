define("Weapon", ["Map", "Player"], function (Map, Player) {

	var weapons = {};

	function define(id, sequence) {
		weapons[id] = sequence;
	}

	Meteor.methods({
		triggerWeapon: function (id) {
			var mapId = Player.getJoinedMapId(this.userId);
			var map = Map.getMapById(mapId);
			var pos = Player.getPosition();

			if (weapons[id]) {
				if (map.grid) {
					weapons[id].call(this,
						map.grid,
						pos.x,
						pos.y,
						this.isSimulation ? setTimeout : Meteor.setTimeout,
						this.isSimulation ? clearTimeout : Meteor.clearTimeout,
						this.isSimulation ? setInterval : Meteor.setInterval,
						this.isSimulation ? clearInterval : Meteor.clearInterval
					);
				}
			} else {
				throw new Error("Invalid weapon type: " + id);
			}
		}
	});

	return {
		define: define
	};

});