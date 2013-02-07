define("Map", ["Collections"], function (Collections) {

	function getMaps() {
		return Collections.ActiveMaps.find();
	}

	function getMapById(mapId) {
		return Collections.ActiveMaps.findOne({_id: mapId});
	}

	function collides(map, pos) {
		if (map) {
			if (!map.grid) {
				// Support passing the map id
				map = getMapById(map);
			}
			if (map.grid && map.grid[pos.y] && map.grid[pos.y][pos.x]) {
				if (map.grid[pos.y][pos.x].trim() !== "") {
					return true;
				}
			}
		}
		return false;
	}

	function getRandomNonCollidePosition(mapId) {
		var map = getMapById(mapId), i, randPos;
		if (map) {
			for (i = 0; i < 5000; i++) {
				randPos = {
					x: Math.floor(Math.random() * map.width),
					y: Math.floor(Math.random() * map.height)
				};
				if (!collides(map, randPos)) {
					return randPos;
				}
			}
		}
	}

	if (Meteor.isServer) {
		(function () {

			function loadMap(content, url) {
				var mapId, existingMap, data;
				var maxLength = 0;

				var grid = [], x, y, line, lineLength;
				var lines = content.split(/\r\n|\r|\n/g);

				for (y = 0; y < lines.length; y++) {
					lineLength = lines[y].length;
					maxLength = lineLength > maxLength ? lineLength : maxLength;
				}

				for (y = 0; y < lines.length; y++) {
					grid[y] = [];
					line = lines[y];
					lineLength = line.length;
					for (x = 0; x < maxLength; x++) {
						if (x < lineLength) {
							grid[y][x] = line.charAt(x);
						} else {
							grid[y][x] = " ";
						}
					}
				}

				data = {
					url: url,
					grid: grid,
					width: maxLength,
					height: y
				};

				existingMap = Collections.ActiveMaps.findOne({url: url});

				if (existingMap) {
					mapId = existingMap._id;
					Collections.ActiveMaps.update({_id: mapId}, {$set: data});
				} else {
					mapId = Collections.ActiveMaps.insert(data);
				}

				return mapId;
			}

			Meteor.methods({
				loadMapByUrl: function (url) {
					var result = Meteor.http.get(url);
					var mapId = null;

					if (result.statusCode === 200) {
						mapId = loadMap(result.content, url);
					}

					return mapId;
				}
			});

		})();
	}

	return {
		getMaps: getMaps,
		getMapById: getMapById,
		collides: collides,
		getRandomNonCollidePosition: getRandomNonCollidePosition
	};

});