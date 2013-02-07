using("Map", "Player", "Sprites", function (Map, Player, Sprites) {

	var viewportCols = 80;
	var viewportRows = 20;

	Template.viewport.render = function () {
		var mapId = Player.getJoinedMapId();
		var map = Map.getMapById(mapId);
		var pos, x1, x2, y1, y2, x, y, players, others = {}, output = "";

		if (map) {
			pos = Player.getPosition();

			if (pos) {
				players = Meteor.users.find();
				players.forEach(function (player) {
					var ox = player.position && player.position.x;
					var oy = player.position && player.position.y;
					if (!others[oy]) {
						others[oy] = {};
					}
					others[oy][ox] = 1;
				});

				x1 = pos.x - (viewportCols / 2);
				x2 = pos.x + (viewportCols / 2);
				y1 = pos.y - (viewportRows / 2);
				y2 = pos.y + (viewportRows / 2);

				for (y = y1; y < y2; y++) {
					for (x = x1; x < x2; x++) {
						if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
							// Render out-of-bounds
							output += Sprites.Map.OOB;
						} else {
							if (x == pos.x && y == pos.y) {
								// Render player
								output += Sprites.Player.YOU;
							} else {
								if (others[y] && others[y][x]) {
									// Render other player
									output += Sprites.Player.OTHER;
								} else {
									// Render map
									output += map.grid[y][x];
								}
							}
						}
					}
					output += "\n";
				}
			}
		}

		return output;
	};

});