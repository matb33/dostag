define("Map", function () {

	var collection = new Meteor.Collection("activeMaps");

	function getMaps() {
		return collection.find();
	}

	if (Meteor.isClient) {
		return (function () {

			function getMap(mapId) {
				return collection.findOne({_id: mapId});
			}

			function collides(map, pos) {
				if (map.grid && map.grid[pos.y] && map.grid[pos.y][pos.x]) {
					if (map.grid[pos.y][pos.x].trim() !== "") {
						return true;
					}
				}
				return false;
			}

			function getOOBChar() {
				return "∙";
			}

			function getRandomNonCollidePosition(mapId) {
				var map = getMap(mapId), i, randPos;
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

			Meteor.startup(function () {
				Meteor.subscribe("maps");
			});

			return {
				getMap: getMap,
				getMaps: getMaps,
				collides: function (mapId, pos) {
					var map = getMap(mapId);
					return map && collides(map, pos);
				},
				getOOBChar: getOOBChar,
				getRandomNonCollidePosition: getRandomNonCollidePosition
			};

		})();
	}

	if (Meteor.isServer) {
		return (function () {

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

				existingMap = collection.findOne({url: url});

				if (existingMap) {
					mapId = existingMap._id;
					collection.update({_id: mapId}, {$set: data});
				} else {
					mapId = collection.insert(data);
				}

				return mapId;
			}

			function loadMapByUrl(url) {
				var result = Meteor.http.get(url);
				var mapId = null;

				if (result.statusCode === 200) {
					mapId = loadMap(result.content, url);
				}

				return mapId;
			}

			collection.allow({
				insert: function (userId) { return false; },
				update: function (userId) { return false; },
				remove: function (userId) { return false; }
			});

			Meteor.methods({
				"loadMapByUrl": loadMapByUrl
			});

			Meteor.publish("activeMap", function (mapId) {
				return collection.find({_id: mapId});
			});

			Meteor.publish("maps", function () {
				return getMaps();
			});

			return {
				loadMapByUrl: loadMapByUrl
			};

		})();
	}

});