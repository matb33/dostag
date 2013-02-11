using("Collections", function (Collections) {

	// Map data can not be modified directly by the client
	Collections.Maps.allow({
		insert: function () {
			return false;
		},
		update: function () {
			return false;
		},
		remove: function () {
			return false;
		}
	});

	// Users aren't allowed to modify their own positions directly
	// They are also not allowed to modify their inventory
	Meteor.users.deny({
		update: function (userId, docs, fields) {
			// TODO: have to find a way to do this properly... need the client to
			// change their position quickly and have it reflect on the server...
			//return _.contains(fields, "position") || _.contains(fields, "inventory");
		}
	});

	// Activity can't be modified directly, use the various Meteor.methods
	Collections.Activities.allow({
		insert: function () {
			return false;
		},
		update: function () {
 			return false;
		},
		remove: function () {
			return false;
		}
	});

	// Damage layer is only modifiable by the server
	Collections.LayerDamage.allow({
		insert: function () {
			return false;
		},
		update: function () {
 			return false;
		},
		remove: function () {
			return false;
		}
	});

	// Overlay layer should ideally only be modifiable by the server, but we
	// don't have another method right now to do simulation... so for now,
	// allow client access (boooo)
	Collections.LayerOverlay.allow({
		insert: function () {
			return true;
		},
		update: function () {
 			return true;
		},
		remove: function () {
			return true;
		}
	});
});