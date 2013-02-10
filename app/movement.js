using("Player", "Map", function (Player, Map) {

	Meteor.methods({
		moveDirection: function (direction) {
			var player = Player.getPlayer(this.userId);
			var pos = Player.getPosition(this.userId);
			var mapId = Player.getJoinedMapId(this.userId);

			if (player.dead) return;

			if (pos && mapId) {
				switch (direction) {
					case 1: pos.x -= 1; break;		// right
					case 2: pos.y -= 1; break;		// up
					case 3: pos.x += 1; break;		// left
					case 4: pos.y += 1; break;		// down
				}
				if (!Map.collides(mapId, pos)) {
					Meteor.users.update({_id: this.userId}, {$set: {position: pos}});
				}
			}
		}
	});

	if (Meteor.isServer) {
		// These methods are only applicable on the server -- they
		// can't be simulated on the client
		Meteor.methods({
			moveToRandomNonCollide: function () {
				var mapId = Player.getJoinedMapId(this.userId);
				var pos = Map.getRandomNonCollidePosition(mapId);

				Meteor.users.update({_id: this.userId}, {$set: {position: pos}});
			}
		});
	}

});