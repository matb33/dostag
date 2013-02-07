define("Collections", function (Collections) {

	var Collections = {};

	Collections.ActiveMaps = new Meteor.Collection("activeMaps");
	Collections.Weapons = new Meteor.Collection("weapons");

	return Collections;

});