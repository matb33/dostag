define("Collections", function (Collections) {

	var Collections = {};

	Collections.Maps = new Meteor.Collection("maps");
	Collections.Activities = new Meteor.Collection("activities");
	Collections.ClientLayers = new Meteor.Collection(null);

	return Collections;

});