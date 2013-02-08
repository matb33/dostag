using("Chat", "Weapon", function (Chat, Weapon) {

	Meteor.startup(function () {
		$(document).keydown(function (evt) {
			var direction;
			var weapon;

			switch (evt.keyCode) {
				case 37: direction = 1; break;			// right
				case 38: direction = 2; break;			// up
				case 39: direction = 3; break;			// left
				case 40: direction = 4; break;			// down

				case 66: weapon = "bomb"; break;		// b
				//case 78: weapon = "napalm"; break;		// n (currently disabled, too slow)

				case 87: weapon = "pickaxe_u"; break;	// w
				case 83: weapon = "pickaxe_d"; break;	// s
				case 65: weapon = "pickaxe_l"; break;	// a
				case 68: weapon = "pickaxe_r"; break;	// d

				case 13:
					Chat.prompt("Say what?");
				break;
			}

			if (direction) {
				Meteor.call("moveDirection", direction);
			}

			if (weapon) {
				Weapon.trigger(weapon);
			}

			return false;
		});
	});

});