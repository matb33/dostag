using("Env", function (Env) {

	function initialize() {
		var map;

		if (Env.isProduction) {
			map = "http://dostag.meteor.com/maps/map1.txt";
		} else {
			map = "http://localhost:3000/maps/map1.txt";
		}

		Meteor.call("loadMapByUrl", map, function (error, mapId) {
			if (!error) {
				Meteor.call("joinMapId", mapId, true);
			}
		});
	}

	Meteor.startup(function () {
		Meteor.autorun(function () {
			// Always force user to be logged-in
			if (!Meteor.userId()) {
				Meteor.call("initiateAccount", function (error, username) {
					Meteor.loginWithPassword({username: username}, "password", function (error) {
						if (error) {
							console.log(error);
						}
					});
				});
			} else {
				initialize();
			}
		});
	});

});