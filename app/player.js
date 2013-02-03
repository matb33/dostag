define("Player", ["Map"], function (Map) {

	var speeds = {
		"normal": 50,
		"fast": 30,
		"slow": 80
	};
	var defaultSpeed = "normal";

	if (Meteor.isClient) {
		return (function () {

			function getPlayerChar() {
				return "☺";
			}

			function getPosition() {
				var player = Meteor.user();
				return player && player.position;
			}

			function setPosition(position) {
				Meteor.users.update({_id: Meteor.userId()}, {$set: {position: position}});
			}

			function getSpeed() {
				var player = Meteor.user();
				return player && player.speed;
			}

			function setSpeed(speed) {
				Meteor.users.update({_id: Meteor.userId()}, {$set: {speed: speeds[speed]}});
			}

			function getDirection() {
				var player = Meteor.user();
				return player && player.direction;
			}

			function setDirection(direction) {
				Meteor.users.update({_id: Meteor.userId()}, {$set: {direction: direction}});
			}

			function joinMapId(mapId) {
				Meteor.users.update({_id: Meteor.userId()}, {$set: {mapId: mapId}});
			}

			function leaveCurrentMap() {
				Meteor.users.update({_id: Meteor.userId()}, {$unset: {mapId: 1}});
			}

			function getJoinedMapId() {
				var player = Meteor.user();
				return player && player.mapId;
			}

			function initialize() {
				Map.loadMapByUrl("http://localhost:4000/maps/map1.txt", function (mapId) {
					setPosition({x: 21, y: 8});
					setSpeed(defaultSpeed);
					setDirection(null);

					joinMapId(mapId);
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

			Meteor.startup(function () {
				Meteor.autosubscribe(function () {
					var player = Meteor.users.findOne({_id: Meteor.userId()});
					if (player) {
						Meteor.subscribe("mapUsers", player.mapId);
						Meteor.subscribe("activeMap", player.mapId);
					}
				});
			});

			return {
				getPlayerChar: getPlayerChar,
				getPosition: getPosition,
				getSpeed: getSpeed,
				getDirection: getDirection,
				setPosition: setPosition,
				setSpeed: setSpeed,
				setDirection: setDirection,
				getJoinedMapId: getJoinedMapId
			};

		})();
	}

	if (Meteor.isServer) {
		return (function () {

			function rand(limit) {
				return Math.floor(Math.random() * limit);
			}

			function generateRandomWord(length) {
				var consonants = "bcdfghjklmnpqrstvwxyz";
				var vowels = "aeiou";
				var i, word = "", length = parseInt(length, 10);
				var consonants = consonants.split("");
				var vowels = vowels.split("");
				var randConsonant;

				for (i = 0; i < length / 2; i++) {
					randConsonant = consonants[rand(consonants.length)],
					randVowel = vowels[rand(vowels.length)];
					word += (i === 0) ? randConsonant.toUpperCase() : randConsonant;
					word += i * 2 < length - 1 ? randVowel : "";
				}

				return word;
			}

			function getUniqueUsername() {
				var word;
				var start = 3, end = 50, tries = 10;
				for (var i = start; i <= end; i += (1 / tries)) {
					word = generateRandomWord(Math.floor(i));
					if (!Meteor.users.findOne({username: word})) {
						return word;
					}
				}
				return false;
			}

			Accounts.config({
				sendVerificationEmail: false,
				forbidClientAccountCreation: false
			});

			Meteor.methods({
				"initiateAccount": function () {
					var username;

					if (Meteor.userId()) {
						username = Meteor.user().username;
					} else {
						// Generate default user account
						username = getUniqueUsername();

						Accounts.createUser({
							username: username,
							password: "password"
						});
					}

					return username;
				}
			});

			// Can only modify own user record
			Meteor.users.allow({
				insert: function (userId) { return userId === Meteor.userId(); },
				update: function (userId) { return userId === Meteor.userId(); },
				remove: function (userId) { return userId === Meteor.userId(); }
			});

			Meteor.publish("mapUsers", function (mapId) {
				return Meteor.users.find({mapId: mapId});
			});
		})();
	}
});