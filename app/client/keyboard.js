Meteor.startup(function () {
	$(document).keydown(function (evt) {
		var direction;

		switch (evt.keyCode) {
			case 37: direction = 1; break;		// right
			case 38: direction = 2; break;		// up
			case 39: direction = 3; break;		// left
			case 40: direction = 4; break;		// down
		}

		if (direction) {
			Meteor.call("moveDirection", direction);
		}

		return false;
	});
});