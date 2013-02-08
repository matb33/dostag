define("Player", function () {

	var heartbeatInterval = 5000;
	var keepaliveTimeout = 30000;

	function getPlayer(userId) {
		return userId ? Meteor.users.findOne({_id: userId}) : Meteor.user();
	}

	function getPosition(userId) {
		var player = getPlayer(userId);
		return player && player.position;
	}

	function getJoinedMapId(userId) {
		var player = getPlayer(userId);
		return player && player.mapId;
	}

	if (Meteor.isServer) {
		(function () {

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
					var username, user;

					if (this.userId) {
						user = Meteor.users.findOne({_id: this.userId});
						username = user && user.username;
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
				keepalive: function () {
					var player = Meteor.users.findOne({_id: this.userId});
					if (player) {
						Meteor.users.update({_id: this.userId}, {$set: {last_keepalive: Date.now()}});
					}
				}
			});

			Meteor.setInterval(function () {
				var idleUsers = Meteor.users.find({last_keepalive: {$lt: (Date.now() - keepaliveTimeout)}});
				idleUsers.forEach(function (idleUser) {
					Meteor.users.update({_id: idleUser._id}, {$set: {idle: true}});
				});
			}, heartbeatInterval);

		})();
	}

	if (Meteor.isClient) {
		Meteor.setInterval(function () {
			Meteor.call("keepalive");
		}, heartbeatInterval);
	}

	return {
		getPosition: getPosition,
		getJoinedMapId: getJoinedMapId
	};

});