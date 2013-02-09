define("Collections", function (Collections) {

	var Collections = {};

	Collections.Maps = new Meteor.Collection("maps");
	Collections.Activities = new Meteor.Collection("activities");

	//====================
	// Layers
	//====================

	// Server and client
	Collections.LayerOverlay = new Meteor.Collection("layerOverlay");
	Collections.LayerDamage = new Meteor.Collection("layerDamage");

	// Client-only
	Collections.LayerWeapons = new Meteor.Collection(null);
	Collections.LayerChatter = new Meteor.Collection(null);

	return Collections;

});