define("Damage", ["Collections"], function (Collections) {

	var stayDeadForMs = 15000;

	function kill(userId) {
		Meteor.users.update({_id: userId}, {$set: {dead: true}});
		Meteor.setTimeout(function () {
			Meteor.users.update({_id: userId}, {$set: {dead: false}});
			Meteor.call("moveToRandomNonCollide", userId);
		}, stayDeadForMs);
	}

	// Detect damage to players caused by the damage layer entering a user pos
	var damageLayer = Collections.LayerDamage.find();
	damageLayer.observe({
		changed: function (doc) {
			var players = Meteor.users.find({mapId: doc.mapId});
			players.forEach(function (player) {
				if (player.position) {
					if (doc[player.position.y + "_" + player.position.x] !== null) {
						kill(player._id);
					}
				}
			});
		}
	});

	// Detect damage to players caused by player entering a damage layer
	var players = Meteor.users.find();
	players.observe({
		changed: function (player) {
			var damageLayer = Collections.LayerDamage.findOne({mapId: player.mapId});
			if (player.position) {
				if (damageLayer[player.position.y + "_" + player.position.x] !== null) {
					kill(player._id);
				}
			}
		}
	});

});