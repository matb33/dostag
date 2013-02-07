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
		}

		// =====================================================================
		// Subscriptions
		// =====================================================================

		if (Meteor.isClient) {
			Meteor.subscribe("maps");

			Meteor.autosubscribe(function () {
				var player = Meteor.user();
				if (player) {
					Meteor.subscribe("mapUsers", player.mapId);
					Meteor.subscribe("activeMap", player.mapId);
				}
			});
		}
	});

});