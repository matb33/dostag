using("Collections", function (Collections) {

	// Active map data can not be modified directly by the client
	Collections.ActiveMaps.allow({
		insert: function () { return false; },
		update: function () { return false; },
		remove: function () { return false; }
	});

	// Users can only modify themselves
	Meteor.users.allow({
		insert: function (userId) { return userId === Meteor.userId(); },
		update: function (userId) { return userId === Meteor.userId(); },
		remove: function (userId) { return userId === Meteor.userId(); }
	});
	// Users aren't allowed to modify their positions directly
	Meteor.users.deny({
		update: function (userId, docs, fields) { return _.contains(fields, "position"); }
	});

});