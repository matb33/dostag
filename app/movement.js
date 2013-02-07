using("Player", "Map", function (Player, Map) {

	Meteor.methods({
		moveDirection: function (direction) {
			var pos = Player.getPosition();
			var mapId = Player.getJoinedMapId();

			if (pos && mapId) {
				switch (direction) {
					case 1: pos.x -= 1; break;		// right
					case 2: pos.y -= 1; break;		// up
					case 3: pos.x += 1; break;		// left
					case 4: pos.y += 1; break;		// down
				}
				if (!Map.collides(mapId, pos)) {
					// TODO: with the security in place, will this work as expected?? Will the client simulate the movement,
					// or will we get Access Denied??
					Meteor.users.update({_id: Meteor.userId()}, {$set: {position: position}});
				}
			}
		}
	});

	if (Meteor.isServer) {
		// These methods are only applicable on the server -- they
		// can't be simulated on the client
		Meteor.methods({
			moveToRandomNonCollide: function () {
				var mapId = Player.getJoinedMapId();
				var position = Map.getRandomNonCollidePosition(mapId);

				Meteor.users.update({_id: Meteor.userId()}, {$set: {position: position}});
			}
		});
	}

});