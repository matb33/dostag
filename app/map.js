define("Map", ["Collections", "Player", "Weapon", "LayerOps", "Layers", "Sprite"], function (Collections, Player, Weapon, LayerOps, Layers, Sprite) {

	function getMaps() {
		return Collections.Maps.find();
	}

	function getMapById(mapId) {
		return Collections.Maps.findOne({_id: mapId});
	}

	function traversable(c) {
		return c === null || c === undefined || c.trim() === "";
	}

	function destructible(c) {
		var indestructible = [
			Sprite.Map.METAL_FULL,
			Sprite.Map.METAL_BOTTOM,
			Sprite.Map.METAL_TOP,
			Sprite.Map.METAL_LEFT,
			Sprite.Map.METAL_RIGHT
		];

		return indestructible.indexOf(c) === -1;
	}

	function collides(map, pos) {
		var overlay, targetChar;
		var key = pos.y + "_" + pos.x;

		if (map) {
			if (!map._id) {
				map = getMapById(map);	// Support passing the map id
			}

			if (pos.x < 0 || pos.y < 0 || pos.x >= map.width || pos.y >= map.height) {
				return true;
			}

			overlay = Layers.getDocument(Layers.OVERLAY, map._id);

			if (map.level && map.level[key]) {
				// If the map char is indestructible, always collide
				if (!destructible(map.level[key])) return true;

				// If an overlay exists in the overlay layer,
				// it should take precedence
				targetChar = overlay && overlay[key] !== null ? overlay[key] : map.level[key];
				if (!traversable(targetChar)) {
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

	Meteor.methods({
		joinMapId: function (mapId, randomizePosition) {
			var map = getMapById(mapId);
			var inventory, data = {};

			if (map) {
				Meteor.users.update({_id: this.userId}, {$set: {
					mapId: mapId,
					idle: false,
					dead: false,
					kills: 0,
					deaths: 0,
					last_keepalive: Date.now(),
					inventory: Weapon.getInitialInventory()
				}});

				// Reset any client layers, like weapon visuals
				Layers.resetClientLayers(map);

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
				var level = LayerOps.mapStringToGridObject(content, "level");

				var data = {
					url: url
				};

				data = _.extend(data, level);

				existingMap = Collections.Maps.findOne({url: url});

				if (existingMap) {
					mapId = existingMap._id;
					Collections.Maps.update({_id: mapId}, {$set: data});
				} else {
					mapId = Collections.Maps.insert(data);
				}

				// Reset any server layers, such as overlay and damage
				Layers.resetServerLayers(_.extend(data, {_id: mapId}));

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
		traversable: traversable,
		destructible: destructible,
		collides: collides,
		getRandomNonCollidePosition: getRandomNonCollidePosition
	};

});