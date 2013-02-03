function ensureIndex(collection, name, options) {
	Meteor.startup(function () {
		// HACK: Allow 60 seconds for the db key to appear
		setTimeout(function () {
			if (collection._driver && collection._driver.mongo && collection._driver.mongo.db) {
				collection._driver.mongo.db.ensureIndex(name, options);
			}
		}, 60000);
	});
}
