using("Map", function (Map) {

	var viewportCols = 80;
	var viewportRows = 20;

	var normalSpeed = 50;
	var fastSpeed = 30;
	var slowSpeed = 80;
	var defaultSpeed = normalSpeed;

	Session.set("pos", {x: 21, y: 8});
	Session.set("speed", defaultSpeed);
	Session.set("dir", null);

	Template.viewport.render = function () {
		var map = Map.getActiveMap();
		var pos, x1, x2, y1, y2, output = "", x, y;

		if (map) {
			pos = Session.get("pos");

			x1 = pos.x - (viewportCols / 2);
			x2 = pos.x + (viewportCols / 2);
			y1 = pos.y - (viewportRows / 2);
			y2 = pos.y + (viewportRows / 2);

			for (y = y1; y < y2; y++) {
				for (x = x1; x < x2; x++) {
					if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
						// Render out-of-bounds
						output += "∙";
					} else {
						if (x == pos.x && y == pos.y) {
							// Render player
							output += "☺";
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

			$(document).keydown(function (evt) {
				var pos = Session.get("pos"), dir;
				switch (evt.keyCode) {
					case 37: 	dir = "right"; break;
					case 38: 	dir = "up"; break;
					case 39: 	dir = "left"; break;
					case 40: 	dir = "down"; break;
				}
				if (evt.shiftKey) {
					Session.set("speed", slowSpeed);
				} else {
					Session.set("speed", normalSpeed);
				}
				Session.set("dir", dir);
				evt.preventDefault();
				return false;
			}).keyup(function (evt) {
				Session.set("dir", null);
				Session.set("speed", defaultSpeed);
			});
		}
	};

	Meteor.startup(function () {
		var speedIntervalId;
		Meteor.autorun(function () {
			Meteor.clearInterval(speedIntervalId);
			speedIntervalId = Meteor.setInterval(function () {
				var pos = Session.get("pos");
				var dir = Session.get("dir");
				switch (dir) {
					case "up": 		pos.y -= 1; break;
					case "down": 	pos.y += 1; break;
					case "left": 	pos.x += 1; break;
					case "right": 	pos.x -= 1; break;
				}
				if (!Map.collides(pos)) {
					Session.set("pos", pos);
				}
			}, Session.get("speed"));
		});
	})

})