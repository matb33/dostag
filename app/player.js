define("Player", ["Map"], function (Map) {

	var heartbeatInterval = 5000;
	var keepaliveTimeout = 30000;

	if (Meteor.isClient) {
		return (function () {

			function getPlayerChar() {
				return "☻";
			}

			function getOtherPlayerChar() {
				return "☺";
			};

			function getPosition() {
				var player = Meteor.user();
				return player && player.position;
			}

			function setPosition(position) {
				Meteor.users.update({_id: Meteor.userId()}, {$set: {position: position}});
			}

			function joinMapId(mapId) {
				Meteor.users.update({_id: Meteor.userId()}, {$set: {mapId: mapId, idle: false, last_keepalive: Date.now()}});
			}

			function leaveCurrentMap() {
				Meteor.users.update({_id: Meteor.userId()}, {$unset: {mapId: 1}});
			}

			function getJoinedMapId() {
				var player = Meteor.user();
				return player && player.mapId;
			}

			Meteor.startup(function () {
				Meteor.autosubscribe(function () {
					var player = Meteor.user();
					if (player) {
						Meteor.subscribe("mapUsers", player.mapId);
						Meteor.subscribe("activeMap", player.mapId);
					}
				});
			});

			Meteor.setInterval(function () {
				Meteor.call("keepalive", Meteor.userId());
			}, heartbeatInterval);

			return {
				getPlayerChar: getPlayerChar,
				getOtherPlayerChar: getOtherPlayerChar,
				getPosition: getPosition,
				setPosition: setPosition,
				getJoinedMapId: getJoinedMapId,
				joinMapId: joinMapId
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
				initiateAccount: function () {
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
				},
				keepalive: function (userId) {
					var player = Meteor.users.findOne({_id: userId});
					if (player) {
						Meteor.users.update({_id: player._id}, {$set: {last_keepalive: Date.now()}});
					}
				}
			});

			Meteor.setInterval(function () {
				var idleUsers = Meteor.users.find({last_keepalive: {$lt: (Date.now() - keepaliveTimeout)}});
				idleUsers.forEach(function (idleUser) {
					Meteor.users.update({_id: idleUser._id}, {$set: {idle: true}});
				});
			}, heartbeatInterval);

			// Can only modify own user record
			Meteor.users.allow({
				insert: function (userId) { return userId === Meteor.userId(); },
				update: function (userId) { return userId === Meteor.userId(); },
				remove: function (userId) { return userId === Meteor.userId(); }
			});

			Meteor.publish("mapUsers", function (mapId) {
				return Meteor.users.find({mapId: mapId, idle: false});
			});
		})();
	}
});