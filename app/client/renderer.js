define("Renderer", ["Map", "Player", "Sprite", "Layers"], function (Map, Player, Sprite, Layers) {

	var viewportCols = 80;
	var viewportRows = 25;

	var vc2 = Math.floor(viewportCols / 2);
	var vr2 = Math.floor(viewportRows / 2)

	Meteor.autorun(function () {
		var mapId, map;
		var pos, x1, x2, y1, y2, x, y, players, key;
		var others = {}, output = "";
		var overlay, weapons, chatter;
		var player = Meteor.user();

		output += "\n";
		output += "      ____   ____  _____ ______ ___    ______  \n";
		output += "     / __ \\ / __ \\/ ___//_  __//   |  / ____/  \n";
		output += "    / / / // / / /\\__ \\  / /  / /| | / / __    \n";
		output += "   / /_/ // /_/ /___/ / / /  / ___ |/ /_/ /    \n";
		output += "  /_____/ \\____//____/ /_/  /_/  |_|\\____/     \n";
		output += "\n\n";
		output += "            L O A D I N G\n";
		output += "\n\n";

		if (player) {
			mapId = Player.getJoinedMapId(player._id);
			map = Map.getMapById(mapId);

			if (map && map.level) {
				pos = Player.getPosition();

				if (pos) {
					// Get positions of other players
					players = Meteor.users.find();
					players.forEach(function (player) {
						var ox = player.position && player.position.x || -1;
						var oy = player.position && player.position.y || -1;
						others[oy + "_" + ox] = player;
					});

					// Get layers
					overlay = Layers.getDocument(Layers.OVERLAY);
					weapons = Layers.getDocument(Layers.WEAPONS);
					chatter = Layers.getDocument(Layers.CHATTER);

					x1 = pos.x - vc2;
					x2 = pos.x + vc2;
					y1 = pos.y - vr2;
					y2 = pos.y + vr2;

					output = "";

					for (y = y1; y < y2; y++) {
						for (x = x1; x < x2; x++) {
							key = y + "_" + x;
							if (chatter[key]) {
								output += chatter[key];
							} else {
								if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
									output += Sprite.Map.OOB;
								} else {
									if (weapons[key]) {
										output += weapons[key];
									} else {
										if (x == pos.x && y == pos.y) {
											output += player.dead ? Sprite.Player.DEAD : Sprite.Player.YOU;
										} else {
											if (others[key]) {
												output += others[key].dead ? Sprite.Player.DEAD : Sprite.Player.OTHER;
											} else {
												if (map.level[key]) {
													if (overlay && overlay[key] && Map.destructible(map.level[key])) {
														output += overlay[key];
													} else {
														output += map.level[key];
													}
												}
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
		}

		Session.set("renderedMap", output);
	});

	return {
		getRenderedMap: function () {
			return Session.get("renderedMap");
		}
	};

})