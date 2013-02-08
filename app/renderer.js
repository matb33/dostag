define("Renderer", ["Map", "Player", "Sprite"], function (Map, Player, Sprite) {

	if (Meteor.isClient) {
		return (function () {

			var viewportCols = 80;
			var viewportRows = 25;

			var vc2 = Math.floor(viewportCols / 2);
			var vr2 = Math.floor(viewportRows / 2)

			Meteor.autorun(function () {
				var player = Meteor.user();
				var mapId = Player.getJoinedMapId(player._id);
				var map = Map.getMapById(mapId);
				var pos, x1, x2, y1, y2, x, y, players, key, clientLayers;
				var others = {}, output = "";

				output += "\n";
				output += "      ____   ____  _____ ______ ___    ______  \n";
				output += "     / __ \\ / __ \\/ ___//_  __//   |  / ____/  \n";
				output += "    / / / // / / /\\__ \\  / /  / /| | / / __    \n";
				output += "   / /_/ // /_/ /___/ / / /  / ___ |/ /_/ /    \n";
				output += "  /_____/ \\____//____/ /_/  /_/  |_|\\____/     \n";
				output += "\n\n";

				if (map) {
					pos = Player.getPosition();

					if (pos) {
						clientLayers = Map.getClientLayers();

						players = Meteor.users.find();
						players.forEach(function (player) {
							var ox = player.position && player.position.x || -1;
							var oy = player.position && player.position.y || -1;
							others[oy + "_" + ox] = true;
						});

						x1 = pos.x - vc2;
						x2 = pos.x + vc2;
						y1 = pos.y - vr2;
						y2 = pos.y + vr2;

						output = "";

						for (y = y1; y < y2; y++) {
							for (x = x1; x < x2; x++) {
								key = y + "_" + x;
								if (clientLayers && clientLayers[Map.LAYER_CHATTER + key]) {
									output += clientLayers[Map.LAYER_CHATTER + key];
								} else {
									if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
										output += Sprite.Map.OOB;
									} else {
										if (clientLayers && clientLayers[Map.LAYER_WEAPONS + key]) {
											output += clientLayers[Map.LAYER_WEAPONS + key];
										} else {
											if (x == pos.x && y == pos.y) {
												output += Sprite.Player.YOU;
											} else {
												if (others[key]) {
													output += Sprite.Player.OTHER;
												} else {
													output += map[Map.LAYER_LEVEL + key];
												}
											}
										}
									}
								}
							}
							output += "\n";
						}
					}
				}

				Session.set("renderedMap", output);
			});

			return {
				getRenderedMap: function () {
					return Session.get("renderedMap");
				}
			};

		})();
	}

})