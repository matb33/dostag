define("Renderer", ["Map", "Player", "Sprites"], function (Map, Player, Sprites) {

	if (Meteor.isClient) {
		return (function () {

			var viewportCols = 80;
			var viewportRows = 30;

			Meteor.autorun(function () {
				var mapId = Player.getJoinedMapId();
				var map = Map.getMapById(mapId);
				var pos, x1, x2, y1, y2, x, y, players;
				var others = {}, output = "";

				output += "\n";
				output += "      ____   ____  _____ ______ ___    ______  \n";
				output += "     / __ \\ / __ \\/ ___//_  __//   |  / ____/  \n";
				output += "    / / / // / / /\\__ \\  / /  / /| | / / __    \n";
				output += "   / /_/ // /_/ /___/ / / /  / ___ |/ /_/ /    \n";
				output += "  /_____/ \\____//____/ /_/  /_/  |_|\\____/     \n";
				output += "\n\n";

				if (map && map.grid) {
					pos = Player.getPosition();

					if (pos) {
						players = Meteor.users.find();
						players.forEach(function (player) {
							var ox = player.position && player.position.x;
							var oy = player.position && player.position.y;
							others[oy + "_" + ox] = true;
						});

						x1 = pos.x - (viewportCols / 2);
						x2 = pos.x + (viewportCols / 2);
						y1 = pos.y - (viewportRows / 2);
						y2 = pos.y + (viewportRows / 2);

						output = "";

						for (y = y1; y < y2; y++) {
							for (x = x1; x < x2; x++) {
								if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
									output += Sprites.Map.OOB;
								} else {
									key = y + "_" + x;
									if (map.overlay[key]) {
										output += map.overlay[key];
									} else {
										if (x == pos.x && y == pos.y) {
											output += Sprites.Player.YOU;
										} else {
											if (others[key]) {
												output += Sprites.Player.OTHER;
											} else {
												output += map.grid[key];
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