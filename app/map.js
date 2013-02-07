define("Map", ["Collections"], function (Collections) {

	function getMaps() {
		return Collections.ActiveMaps.find();
	}

	function getMapById(mapId) {
		return Collections.ActiveMaps.findOne({_id: mapId});
	}

	function isTraversable(c) {
		return c === null || c === undefined || c.trim() === "";
	}

	function collides(map, pos) {
		var key;
		if (map) {
			if (!map.grid) {
				// Support passing the map id
				map = getMapById(map);
			}
			key = pos.y + "_" + pos.x;
			if (map.grid && map.grid[key]) {
				if (!isTraversable(map.grid[key])) {
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

	function mapStringToGridObject(map) {
		var maxLength = 0;
		var grid = {}, x, y, line, lineLength, key;
		var lines = map.split(/\r\n|\r|\n/g);

		for (y = 0; y < lines.length; y++) {
			lineLength = lines[y].length;
			maxLength = lineLength > maxLength ? lineLength : maxLength;
		}

		for (y = 0; y < lines.length; y++) {
			line = lines[y];
			lineLength = line.length;
			for (x = 0; x < maxLength; x++) {
				key = y + "_" + x;
				if (x < lineLength) {
					grid[key] = line.charAt(x);
				} else {
					grid[key] = " ";
				}
			}
		}

		return {
			grid: grid,
			width: maxLength,
			height: y
		};
	}

	function generateNullGridObject(w, h) {
		var grid = {};
		for (y = 0; y < h; y++) {
			for (x = 0; x < w; x++) {
				grid[y + "_" + x] = null;
			}
		}
		return grid;
	}

	if (Meteor.isServer) {
		(function () {

			function loadMap(content, url) {
				var mapId, existingMap, data, x, y;
				var result = mapStringToGridObject(content);
				var overlay = generateNullGridObject(result.width, result.height);

				data = {
					url: url,
					content: content,
					grid: result.grid,
					overlay: overlay,
					width: result.width,
					height: result.height
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
		isTraversable: isTraversable,
		collides: collides,
		getRandomNonCollidePosition: getRandomNonCollidePosition,
		mapStringToGridObject: mapStringToGridObject,
		generateNullGridObject: generateNullGridObject
	};

});