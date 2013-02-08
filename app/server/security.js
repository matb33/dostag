using("Collections", function (Collections) {

	// Active map data can not be modified directly by the client
	Collections.ActiveMaps.allow({
		insert: function () {
			return false;
		},
		update: function (userId, docs, fields) {
			// TODO: Figure out how we can do this better... this gives the client
			// full access to mess with the various layers
 			return _.contains(fields, "level") || _.contains(fields, "chatter") || _.contains(fields, "weapons");
		},
		remove: function () {
			return false;
		}
	});

	// Users aren't allowed to modify their own positions directly
	Meteor.users.deny({
		update: function (userId, docs, fields) {
			return _.contains(fields, "position");
		}
	});

});