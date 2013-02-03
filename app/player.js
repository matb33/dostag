define("Player", ["Map"], function (Map) {

	var speeds = {
		"normal": 50,
		"fast": 30,
		"slow": 80
	};
	var defaultSpeed = "normal";
	var collection = new Meteor.Collection("players");

	if (Meteor.isClient) {
		return (function () {

			function getPlayerChar() {
				return "☺";
			}

			function getPosition() {
				return Session.get("pos");
			}

			function setPosition(pos) {
				Session.set("pos", pos);
			}

			function getSpeed() {
				return Session.get("speed");
			}

			function setSpeed(speed) {
				Session.set("speed", speeds[speed]);
			}

			function getDirection() {
				return Session.get("direction");
			}

			function setDirection(direction) {
				Session.set("direction", direction);
			}

			function bindKeys() {
				$(document).keydown(function (evt) {
					var pos = getPosition();
					var dir;

					switch (evt.keyCode) {
						case 37: dir = "right"; break;
						case 38: dir = "up"; break;
						case 39: dir = "left"; break;
						case 40: dir = "down"; break;
					}

					if (dir) {
						setDirection(dir);
					}

					if (evt.keyCode === 16 || evt.shiftKey) {
						setSpeed("slow");
					} else {
						setSpeed("normal");
					}

					return false;
				}).keyup(function (evt) {
					switch (evt.keyCode) {
						case 37:
						case 38:
						case 39:
						case 40:
							setDirection(null);
							setSpeed(defaultSpeed);
						break;
						case 16:
							setSpeed(defaultSpeed);
					}

					return false;
				});

				Meteor.startup(function () {
					var speedIntervalId;
					Meteor.autorun(function () {
						Meteor.clearInterval(speedIntervalId);
						speedIntervalId = Meteor.setInterval(function () {
							var pos = getPosition();
							var dir = getDirection();
							switch (dir) {
								case "up": 		pos.y -= 1; break;
								case "down": 	pos.y += 1; break;
								case "left": 	pos.x += 1; break;
								case "right": 	pos.x -= 1; break;
							}
							if (!Map.collides(pos)) {
								setPosition(pos);
							}
						}, getSpeed());
					});
				});
			}

			Meteor.startup(function () {
				setPosition({x: 21, y: 8});
				setSpeed(defaultSpeed);
				setDirection(null);
			});

			return {
				getPlayerChar: getPlayerChar,
				getPosition: getPosition,
				bindKeys: bindKeys
			};

		})();
	}

});