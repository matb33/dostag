define("Damage", ["Collections", "Map", "Player"], function (Collections, Map, Player) {

	var stayDeadForMs = 15000;

	function kill(userId, killerId) {
		var mapId = Player.getJoinedMapId(userId);
		var pos = Map.getRandomNonCollidePosition(mapId);

		Meteor.users.update({_id: userId}, {$set: {dead: true}, $inc: {deaths: 1}});

		if (userId !== killerId) {
			Meteor.users.update({_id: killerId}, {$inc: {kills: 1}});
		}

		Meteor.setTimeout(function () {
			Meteor.users.update({_id: userId}, {$set: {dead: false, position: pos}});
		}, stayDeadForMs);
	}

	// Detect damage to players caused by the damage layer entering a user pos
	var damageLayer = Collections.LayerDamage.find();
	damageLayer.observe({
		changed: function (doc) {
			var players = Meteor.users.find({mapId: doc.mapId});
			players.forEach(function (player) {
				var data;
				if (player.position) {
					data = doc[player.position.y + "_" + player.position.x];
					if (data && data.c !== null) {
						kill(player._id, data.u);
					}
				}
			});
		}
	});

	// Detect damage to players caused by player entering a damage layer
	var players = Meteor.users.find();
	players.observe({
		changed: function (player) {
			var data, damageLayer = Collections.LayerDamage.findOne({mapId: player.mapId});
			if (player.position) {
				data = damageLayer[player.position.y + "_" + player.position.x];
				if (data && data.c !== null) {
					kill(player._id, data.u);
				}
			}
		}
	});

});