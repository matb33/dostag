define("Stats", ["Weapon"], function (Weapon) {

	function getPlayerCount() {
		return Meteor.users.find({idle: false}).count();
	}

	function getInventory() {
		var inventory = [];
		var player = Meteor.user();

		_.each(Weapon.defs, function (def, id) {
			var count = player.inventory && player.inventory[id] || 0;
			if (count !== -1 && def.initial !== -1) {
				inventory.push({
					id: id,
					count: count,
					sprite: def.inventorySprite
				});
			}
		});

		return inventory;
	}

	return {
		getPlayerCount: getPlayerCount,
		getInventory: getInventory
	};

});