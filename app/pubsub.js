using("Collections", "Map", function (Collections, Map) {

	Meteor.startup(function () {

		// =====================================================================
		// Publishes
		// =====================================================================

		if (Meteor.isServer) {
			Meteor.publish("activeMap", function (mapId) {
				return Map.getMapById(mapId);
			});

			Meteor.publish("maps", function () {
				return Map.getMaps();
			});

			Meteor.publish("mapUsers", function (mapId) {
				return Meteor.users.find({mapId: mapId, idle: false});
			});

			Meteor.publish("mapActivities", function (mapId) {
				return Collections.Activities.find({mapId: mapId});
			});

			Meteor.publish("layerOverlay", function (mapId) {
				return Collections.LayerOverlay.find({mapId: mapId});
			});
		}

		// =====================================================================
		// Subscriptions
		// =====================================================================

		if (Meteor.isClient) {
			Meteor.subscribe("maps");

			Meteor.autorun(function () {
				var player = Meteor.user();
				if (player) {
					Meteor.subscribe("mapUsers", player.mapId);
					Meteor.subscribe("activeMap", player.mapId);
					Meteor.subscribe("mapActivities", player.mapId);
					Meteor.subscribe("layerOverlay", player.mapId);
				}
			});
		}
	});

});