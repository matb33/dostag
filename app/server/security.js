using("Collections", function (Collections) {

	// Active map data can not be modified directly by the client
	Collections.Maps.allow({
		insert: function () {
			return false;
		},
		update: function (userId, docs, fields) {
			// TEMPORARY! just allow client to modify so we don't get
			// access denied despite it working on the server
 			return true;
		},
		remove: function () {
			return false;
		}
	});

	// Users aren't allowed to modify their own positions directly
	Meteor.users.deny({
		update: function (userId, docs, fields) {
			// TODO: is this even working? double-check that this is getting called
			return _.contains(fields, "position");
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
		remove: function (userId, docs) {
			return false;
		}
	});
});