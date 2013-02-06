using("Map", "Player", function (Map, Player) {

	var viewportCols = 80;
	var viewportRows = 20;

	Template.viewport.render = function () {
		var mapId = Player.getJoinedMapId();
		var map = Map.getMap(mapId);
		var oobChar = Map.getOOBChar();
		var playerChar = Player.getPlayerChar();
		var otherPlayerChar = Player.getOtherPlayerChar();
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
							output += oobChar;
						} else {
							if (x == pos.x && y == pos.y) {
								// Render player
								output += playerChar;
							} else {
								if (others[y] && others[y][x]) {
									// Render other player
									output += otherPlayerChar;
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

	var hasRendered = false;
	Template.viewport.rendered = function () {
		if (!hasRendered) {
			hasRendered = true;
			bindKeys();
		}
	};

	function bindKeys() {
		$(document).keydown(function (evt) {
			var pos = Player.getPosition();
			var mapId = Player.getJoinedMapId();

			if (pos && mapId) {
				switch (evt.keyCode) {
					case 37: pos.x -= 1; break;		// right
					case 38: pos.y -= 1; break;		// up
					case 39: pos.x += 1; break;		// left
					case 40: pos.y += 1; break;		// down
				}
				if (!Map.collides(mapId, pos)) {
					Player.setPosition(pos);
				}
			}

			return false;
		});
	}

});