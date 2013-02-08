	/*
define("Stats", ["Weapon", "Sprite", "Player", "Map", "LayerOps"], function (Weapon, Sprite, Player, Map, LayerOps) {

	function getStats(player) {
		var mapId = Player.getJoinedMapId(player._id);
		var playerCount = Meteor.users.find({mapId: mapId, idle: false}).count();
		var inventoryCounts = {};

		_.each(Weapon.defs, function (def, id) {
			inventoryCounts[id] = player.inventory && player.inventory[id] || 0;
		});

		return {
			playerCount: playerCount,
			inventoryCounts: inventoryCounts
		};
	}

	// Continue this... it's super slow atm =(
	// Consider just doing this outside the DOS box
	Meteor.startup(function () {
		Meteor.autorun(function () {
			var stats, mapId, map, render = "", line = "", result;
			var player = Meteor.user();

			if (player) {
				stats = getStats(player);
				mapId = Player.getJoinedMapId(player._id);
				map = Map.getMapById(mapId);

				if (map) {
					line += stats.playerCount + Sprite.Player.OTHER;

					_.each(stats.inventoryCounts, function (count, id) {
						if (count !== -1) {
							line += (" " + count + Weapon.defs[id].sprite);
						}
					});

					render += str_repeat("─", line.length) + "╮\n";
					render += line + "│";

					hud = LayerOps.mapStringToGridObject("", render);

					Session.set("hud", hud);
				}
			}
		});
	});

});
	*/
