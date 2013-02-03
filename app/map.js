define("Map", function () {

	var defaultMapUrl = "http://localhost:3000/maps/map1.txt";
	var collection = new Meteor.Collection("activeMaps");

	if (Meteor.isClient) {
		return (function () {

			function loadMapByUrl(url) {
				Meteor.call("loadMapByUrl", url, function (error, activeMapId) {
					if (!error) {
						setActiveMapId(activeMapId);
					}
				});
			}

			function getMap(mapId) {
				return collection.findOne({_id: mapId});
			}

			function getActiveMap() {
				return getMap(getActiveMapId());
			}

			function getActiveMapId() {
				return Session.get("activeMapId");
			}

			function setActiveMapId(mapId) {
				Session.set("activeMapId", mapId);
			}

			function collides(pos) {
				var map = getActiveMap();
				if (map) {
					if (map.grid && map.grid[pos.y] && map.grid[pos.y][pos.x]) {
						if (map.grid[pos.y][pos.x].trim() !== "") {
							return true;
						}
					}
				}
				return false;
			}

			function getOOBChar() {
				return "∙";
			}

			Meteor.startup(function () {
				loadMapByUrl(defaultMapUrl);

				Meteor.autosubscribe(function () {
					Meteor.subscribe("activeMap", getActiveMapId());
				});
			});

			return {
				loadMapByUrl: loadMapByUrl,
				getActiveMap: getActiveMap,
				collides: collides,
				getOOBChar: getOOBChar
			};

		})();
	}

	if (Meteor.isServer) {
		return (function () {

			function loadMap(content, url) {
				var mapId;
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

				mapId = collection.insert({
					url: url,
					grid: grid,
					width: maxLength,
					height: y
				});

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

			return {
				loadMapByUrl: loadMapByUrl
			};

		})();
	}

});