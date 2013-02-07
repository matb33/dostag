using("Collections", function (Collections) {

	// Active map data can not be modified directly by the client
	// However, we are allowing the client to modify the overlay property
	Collections.ActiveMaps.allow({
		insert: function () {
			return false;
		},
		update: function (userId, docs, fields) {
			return _.contains(fields, "overlay");
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