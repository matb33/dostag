define("Stats", ["Weapon"], function (Weapon) {

	function getPlayerCount() {
		return Meteor.users.find({idle: false}).count();
	}

	function getKills() {
		var player = Meteor.user();
		if (player) {
			return player.kills || 0;
		}
	}

	function getDeaths() {
		var player = Meteor.user();
		if (player) {
			return player.deaths || 0;
		}
	}

	function getInventory() {
		var inventory = [];
		var player = Meteor.user();

		if (player) {
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
		}

		return inventory;
	}

	function getTopKills(limit) {
		var options = {sort: {kills: -1}};
		if (limit > 0) {
			options = _.extend(options, {limit: limit});
		}
		return Meteor.users.find({idle: false}, options);
	}

	function getTopDeaths(limit) {
		var options = {sort: {deaths: -1}};
		if (limit > 0) {
			options = _.extend(options, {limit: limit});
		}
		return Meteor.users.find({idle: false}, options);
	}

	return {
		getPlayerCount: getPlayerCount,
		getInventory: getInventory,
		getKills: getKills,
		getTopKills: getTopKills,
		getTopDeaths: getTopDeaths
	};

});