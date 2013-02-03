using("Map", "Player", function (Map, Player) {

	var viewportCols = 80;
	var viewportRows = 20;

	Template.viewport.render = function () {
		var map = Map.getActiveMap();
		var oobChar = Map.getOOBChar();
		var playerChar = Player.getPlayerChar();
		var pos, x1, x2, y1, y2, output = "", x, y;

		if (map) {
			pos = Player.getPosition();

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
							// Render map
							output += map.grid[y][x];
						}
					}
				}
				output += "\n";
			}
		}

		return output;
	};

	var hasRendered = false;

	Template.viewport.rendered = function () {
		if (!hasRendered) {
			hasRendered = true;
			Player.bindKeys();
		}
	};

});