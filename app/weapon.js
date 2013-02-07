define("Weapon", ["Map", "Player", "Renderer", "Damager"], function (Map, Player, Renderer, Damager) {

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
						Renderer,
						Damager,
						this.isSimulation ? setTimeout : Meteor.setTimeout
					);
				}
			} else {
				throw new Error("Invalid weapon type: " + id);
			}
		}
	});

	/*
	if (Meteor.isServer) {
		(function () {
		})();
	}

	if (Meteor.isClient) {
		(function () {
		})();
	}
	*/

	return {
		define: define
	};

});