define("Renderer", ["Map", "Player", "Sprite"], function (Map, Player, Sprite) {

	if (Meteor.isClient) {
		return (function () {

			var viewportCols = 80;
			var viewportRows = 30;

			Meteor.autorun(function () {
				var player = Meteor.user();
				var mapId = Player.getJoinedMapId(player._id);
				var map = Map.getMapById(mapId);
				var pos, x1, x2, y1, y2, x, y, players, stats;
				var key, hudkey;
				var others = {}, output = "";

				output += "\n";
				output += "      ____   ____  _____ ______ ___    ______  \n";
				output += "     / __ \\ / __ \\/ ___//_  __//   |  / ____/  \n";
				output += "    / / / // / / /\\__ \\  / /  / /| | / / __    \n";
				output += "   / /_/ // /_/ /___/ / / /  / ___ |/ /_/ /    \n";
				output += "  /_____/ \\____//____/ /_/  /_/  |_|\\____/     \n";
				output += "\n\n";

				if (map && map.level) {
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
								key = y + "_" + x;
								if (map.chatter[key]) {
									output += map.chatter[key];
								} else {
									if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
										output += Sprite.Map.OOB;
									} else {
										if (map.weapons[key]) {
											output += map.weapons[key];
										} else {
											if (x == pos.x && y == pos.y) {
												output += Sprite.Player.YOU;
											} else {
												if (others[key]) {
													output += Sprite.Player.OTHER;
												} else {
													output += map.level[key];
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