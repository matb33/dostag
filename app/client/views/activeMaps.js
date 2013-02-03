using("Map", "Player", function (Map, Player) {
	Template.activeMaps.maps = function () {
		return Map.getMaps();
	};

	Template.activeMaps.isActive = function () {
		var mapId = Player.getJoinedMapId();
		return this._id === mapId;
	};

	Template.activeMaps.events({
		"click button": function (evt, template) {
			// TODO: why is template.data undefined??
			Player.joinMapId(evt.target.value);
		}
	})
});