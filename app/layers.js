define("Layers", ["Collections", "LayerOps"], function (Collections, LayerOps) {

	var SERVER = 1;
	var CLIENT = 2;

	var OVERLAY = 10;
	var DAMAGE = 20;
	var WEAPONS = 30;
	var CHATTER = 40;

	var LOCATIONS = {};

	LOCATIONS[OVERLAY] = SERVER;
	LOCATIONS[DAMAGE] = SERVER;
	LOCATIONS[WEAPONS] = CLIENT;
	LOCATIONS[CHATTER] = CLIENT;

	function getCollection(layerName) {
		if (layerName == OVERLAY) {
			return Collections.LayerOverlay;
		}
		if (layerName == DAMAGE) {
			return Collections.LayerDamage;
		}
		if (layerName == WEAPONS) {
			return Collections.LayerWeapons;
		}
		if (layerName == CHATTER) {
			return Collections.LayerChatter;
		}
	}

	function getDocument(layerName, optMapId) {
		var collection = getCollection(layerName);

		if (Meteor.isServer) {
			return collection.findOne({mapId: optMapId});
		} else {
			// No need for mapId, already in scope of the current map,
			// since client can only see current map
			return collection.findOne();
		}
	}

	function resetClientLayers(map) {
		_.each(LOCATIONS, function (type, layerName) {
			var collection, data;
			if (type === CLIENT) {
				collection = getCollection(layerName);
				data = LayerOps.generateNullGridObject(map.width, map.height);

				collection.remove({});
				collection.insert(data);
			}
		});
	}

	function resetServerLayers(map) {
		_.each(LOCATIONS, function (type, layerName) {
			var collection, data;
			if (type === SERVER) {
				collection = getCollection(layerName);
				data = LayerOps.generateNullGridObject(map.width, map.height);
				_.extend(data, {mapId: map._id});

				collection.remove({mapId: map._id});
				collection.insert(data);
			}
		});
	}

	function getLayerData(layerName, optMapId) {
		return {
			collection: getCollection(layerName),
			doc: getDocument(layerName, optMapId)
		};
	}

	function add(layerName, x, y, text, optMapId) {
		var set = _.isString(text) ? LayerOps.add(x, y, text) : text;
		var layer = getLayerData.call(this, layerName, optMapId);
		layer.collection.update({_id: layer.doc._id}, {$set: set});
	}

	function sub(layerName, x, y, text, optMapId) {
		var set = _.isString(text) ? LayerOps.sub(x, y, text) : text;
		var layer = getLayerData.call(this, layerName, optMapId);
		layer.collection.update({_id: layer.doc._id}, {$set: set});
	}

	function clear(layerName, optMapId) {
		var set = LayerOps.generateNullGridObject(layer.doc.width, layer.doc.height);
		var layer = getLayerData.call(this, layerName, optMapId);
		layer.collection.update({_id: layer.doc._id}, {$set: set});
	}

	return {
		resetClientLayers: resetClientLayers,
		resetServerLayers: resetServerLayers,
		getDocument: getDocument,

		add: add,
		sub: sub,
		clear: clear,

		OVERLAY: OVERLAY,
		DAMAGE: DAMAGE,
		WEAPONS: WEAPONS,
		CHATTER: CHATTER
	};

});