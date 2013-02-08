define("Map", ["Collections", "Player", "LayerOps"], function (Collections, Player, LayerOps) {

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
			if (!map.level) {
				map = getMapById(map);	// Support passing the map id
			}
			if (pos.x < 0 || pos.y < 0 || pos.x >= map.width || pos.y >= map.height) {
				return true;
			}
			key = pos.y + "_" + pos.x;
			if (map.level && map.level[key]) {
				if (!isTraversable(map.level[key])) {
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

	function layerAdd(layer, sx, sy, text) {
		if (!this.userId) throw new Error("You must use layerAdd.call syntax originating from within the context of Meteor.methods");

		var mapId = Player.getJoinedMapId(this.userId);
		var map = getMapById(mapId);
		var set = {};

		set[layer] = LayerOps.add(sx, sy, text, map[layer]);

		Collections.ActiveMaps.update({_id: mapId}, {$set: set});
	}

	function layerSub(layer, sx, sy, text) {
		if (!this.userId) throw new Error("You must use layerSub.call syntax originating from within the context of Meteor.methods");

		var mapId = Player.getJoinedMapId(this.userId);
		var map = getMapById(mapId);
		var set = {};

		set[layer] = LayerOps.sub(sx, sy, text, map[layer]);

		Collections.ActiveMaps.update({_id: mapId}, {$set: set});
	}

	function layerClear(layer) {
		if (!this.userId) throw new Error("You must use layerClear.call syntax originating from within the context of Meteor.methods");

		var mapId = Player.getJoinedMapId(this.userId);
		var map = getMapById(mapId);
		var set = {};

		set[layer] = LayerOps.generateNullGridObject(map.width, map.height);

		Collections.ActiveMaps.update({_id: mapId}, {$set: set});
	}

	Meteor.methods({
		joinMapId: function (mapId, randomizePosition) {
			var map = getMapById(mapId);

			if (map) {
				Meteor.users.update({_id: this.userId}, {$set: {
					mapId: mapId,
					idle: false,
					last_keepalive: Date.now(),
					inventory: {} /* TODO: fill this with defaults */
				}});

				if (randomizePosition) {
					Meteor.call("moveToRandomNonCollide");
				}
			}
		},
		leaveCurrentMap: function () {
			Meteor.users.update({_id: this.userId}, {$unset: {mapId: 1}});
		}
	});

	if (Meteor.isServer) {
		(function () {

			function loadMap(content, url) {
				var mapId, existingMap, data, x, y;

				var result = LayerOps.mapStringToGridObject(content);
				var weapons = LayerOps.generateNullGridObject(result.width, result.height);
				var chatter = LayerOps.generateNullGridObject(result.width, result.height);

				data = {
					url: url,
					content: content,
					level: result.grid,
					weapons: weapons,
					chatter: chatter,
					width: result.width,
					height: result.height
				};

				existingMap = Collections.ActiveMaps.findOne({url: url});

				if (existingMap) {
					mapId = existingMap._id;
					// TODO: This update should eventually be removed in favor of resetting the map by reading in the "content" field
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

		layerAdd: layerAdd,
		layerSub: layerSub,
		layerClear: layerClear
	};

});