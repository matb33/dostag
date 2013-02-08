define("Weapon", ["Activity"], function (Activity) {

	var defs = {};

	function define(def) {
		if (typeof def.id === "undefined") throw new Error("Weapon definition missing 'id'");
		if (typeof def.initial === "undefined") throw new Error("Weapon definition missing 'initial'");
		if (typeof def.resupply === "undefined") throw new Error("Weapon definition missing 'resupply'");
		if (typeof def.inventorySprite === "undefined") throw new Error("Weapon definition missing 'inventorySprite'");
		if (defs[def.id]) throw new Error("Weapon '" + def.id + "' already defined");

		defs[def.id] = def;
	}

	function getInitialInventory() {
		return {};	// TODO, write this based on weapon def
	}

	function trigger(id) {
		if (defs[id]) {
			Meteor.call("pushActivity", {
				module: "Weapon",
				data: id
			});
		} else {
			throw new Error("Invalid weapon type: " + id);
		}
	}

	function processActivity(next) {
		if (typeof defs[this.data].sequence === "function") {
			defs[this.data].sequence.call(this, next);
		}
	}

	return {
		define: define,
		trigger: trigger,
		defs: defs,
		getInitialInventory: getInitialInventory,
		processActivity: processActivity
	};

});