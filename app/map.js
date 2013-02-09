define("Map", ["Collections", "Player", "LayerOps", "Weapon"], function (Collections, Player, LayerOps, Weapon) {

	var SERVER_LAYER = 1;
	var CLIENT_LAYER = 2;

	var LAYER_LEVEL = "Yl";
	var LAYER_DAMAGE = "Yd";
	var LAYER_WEAPONS = "Yw";
	var LAYER_CHATTER = "Yc";

	var LAYER_LOCATIONS = {};

	LAYER_LOCATIONS[LAYER_LEVEL] = SERVER_LAYER;
	LAYER_LOCATIONS[LAYER_DAMAGE] = SERVER_LAYER;
	LAYER_LOCATIONS[LAYER_WEAPONS] = CLIENT_LAYER;
	LAYER_LOCATIONS[LAYER_CHATTER] = CLIENT_LAYER;

	function getMaps() {
		// TODO: find a way to exclude LAYER_DAMAGE properties from being published
		return Collections.Maps.find();
	}

	function getMapById(mapId) {
		return Collections.Maps.findOne({_id: mapId});
	}

	function getClientLayers() {
		return Collections.ClientLayers.findOne();
	}

	function isTraversable(c) {
		return c === null || c === undefined || c.trim() === "";
	}

	function collides(map, pos) {
		var key;
		if (map) {
			if (!map._id) {
				map = getMapById(map);	// Support passing the map id
			}
			if (pos.x < 0 || pos.y < 0 || pos.x >= map.width || pos.y >= map.height) {
				return true;
			}
			key = LAYER_LEVEL + pos.y + "_" + pos.x;
			if (map[key]) {
				if (!isTraversable(map[key])) {
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

	function getLayer(name) {
		if (LAYER_LOCATIONS[name] === SERVER_LAYER) {
			if (!this.userId) throw new Error("You must use call syntax originating from within the context of Meteor.methods");
			return {
				collection: Collections.Maps,
				doc: getMapById(Player.getJoinedMapId(this.userId))
			};
		}

		if (LAYER_LOCATIONS[name] === CLIENT_LAYER) {
			return {
				collection: Collections.ClientLayers,
				doc: getClientLayers()
			};
		}
	}

	function layerAdd(layerName, x, y, text) {
		var layer = getLayer.call(this, layerName);
		var set = LayerOps.add(layerName, x, y, text);
		layer.collection.update({_id: layer.doc._id}, {$set: set});
	}

	function layerSub(layerName, x, y, text) {
		var layer = getLayer.call(this, layerName);
		var set = LayerOps.sub(layerName, x, y, text);
		layer.collection.update({_id: layer.doc._id}, {$set: set});
	}

	function layerClear(layerName) {
		var layer = getLayer.call(this, layerName);
		var set = LayerOps.generateNullGridObject(layerName, layer.doc.width, layer.doc.height);
		layer.collection.update({_id: layer.doc._id}, {$set: set});
	}

	Meteor.methods({
		joinMapId: function (mapId, randomizePosition) {
			var map = getMapById(mapId);
			var inventory, data = {};

			if (map) {
				Meteor.users.update({_id: this.userId}, {$set: {
					mapId: mapId,
					idle: false,
					last_keepalive: Date.now(),
					inventory: Weapon.getInitialInventory()
				}});

				// Always only a single document in this collection for
				// performance reasons
				data = _.extend(data, LayerOps.generateNullGridObject(LAYER_WEAPONS, map.width, map.height));
				data = _.extend(data, LayerOps.generateNullGridObject(LAYER_CHATTER, map.width, map.height));
				Collections.ClientLayers.remove({});
				Collections.ClientLayers.insert(data);

				// Clean-up any activities you may have left behind
				// in this map or another
				Collections.Activities.remove({userId: this.userId});

				if (randomizePosition) {
					Meteor.call("moveToRandomNonCollide");
				}
			}
		},
		leaveCurrentMap: function () {
			Meteor.users.update({_id: this.userId}, {$unset: {mapId: 1}});
			Collections.Activities.remove({userId: this.userId});
		}
	});

	if (Meteor.isServer) {
		(function () {

			function loadMap(content, url) {
				var mapId, existingMap;

				var data = {
					url: url,
					content: content
				};

				var levelLayer = LayerOps.mapStringToGridObject(LAYER_LEVEL, content);
				var damageLayer = LayerOps.generateNullGridObject(LAYER_DAMAGE, levelLayer.width, levelLayer.height);

				data = _.extend(data, levelLayer);
				data = _.extend(data, damageLayer);

				existingMap = Collections.Maps.findOne({url: url});

				if (existingMap) {
					mapId = existingMap._id;
					// TODO: This update should eventually be removed in favor of resetting the map by reading in the "content" field
					Collections.Maps.update({_id: mapId}, {$set: data});
				} else {
					mapId = Collections.Maps.insert(data);
				}

				Collections.Activities.remove({mapId: mapId});

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
		getClientLayers: getClientLayers,

		layerAdd: layerAdd,
		layerSub: layerSub,
		layerClear: layerClear,

		LAYER_LEVEL: LAYER_LEVEL,
		LAYER_DAMAGE: LAYER_DAMAGE,
		LAYER_WEAPONS: LAYER_WEAPONS,
		LAYER_CHATTER: LAYER_CHATTER
	};

});