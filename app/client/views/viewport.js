using("Map", "Player", function (Map, Player) {

	var viewportCols = 80;
	var viewportRows = 20;

	Template.viewport.render = function () {
		var mapId = Player.getJoinedMapId();
		console.log(mapId);
		var map = Map.getMap(mapId);
		var oobChar = Map.getOOBChar();
		var playerChar = Player.getPlayerChar();
		var pos, x1, x2, y1, y2, output = "", x, y;

		if (map) {
			pos = Player.getPosition();

			if (pos) {
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
			var dir;

			switch (evt.keyCode) {
				case 37: dir = "right"; break;
				case 38: dir = "up"; break;
				case 39: dir = "left"; break;
				case 40: dir = "down"; break;
			}

			if (dir) {
				Player.setDirection(dir);
			}

			if (evt.keyCode === 16 || evt.shiftKey) {
				Player.setSpeed("slow");
			} else {
				Player.setSpeed("normal");
			}

			return false;
		}).keyup(function (evt) {
			switch (evt.keyCode) {
				case 37:
				case 38:
				case 39:
				case 40:
					Player.setDirection(null);
					Player.setSpeed(defaultSpeed);
				break;
				case 16:
					Player.setSpeed(defaultSpeed);
			}

			return false;
		});

		Meteor.startup(function () {
			var speedIntervalId;
			Meteor.autorun(function () {
				var speed = Player.getSpeed();
				if (speed) {
					Meteor.clearInterval(speedIntervalId);
					speedIntervalId = Meteor.setInterval(function () {
						var pos = Player.getPosition();
						var dir = Player.getDirection();
						var mapId = Player.getJoinedMapId();
						if (pos && dir && mapId) {
							switch (dir) {
								case "up": 		pos.y -= 1; break;
								case "down": 	pos.y += 1; break;
								case "left": 	pos.x += 1; break;
								case "right": 	pos.x -= 1; break;
							}
							if (!Map.collides(mapId, pos)) {
								Player.setPosition(pos);
							}
						}
					}, speed);
				}
			});
		});
	}

});