define("Damage", ["Collections"], function (Collections) {

	// Detect damage to players caused by the damage layer
	var damageLayer = Collections.LayerDamage.find();
	var handle = damageLayer.observe({
		changed: function (doc) {
			var players = Meteor.users.find({mapId: doc.mapId});
			players.forEach(function (player) {
				if (player.position) {
					if (doc[player.position.y + "_" + player.position.x] !== null) {
						Meteor.users.update({_id: player._id}, {$set: {dead: true}});
					}
				}
			});
		}
	});

});