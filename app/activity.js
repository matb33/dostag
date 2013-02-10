// Activities are used to push an "activity", i.e. an arbitrary task, for all
// clients to execute. For example, have all clients display a chat box. Or have
// all clients render an animation.

// Modules that implement an Activity.push must expose a processActivity
// function, and are responsible for calling the passed callback for cleanup.
// Optionally, they can also expose a verifyActivity, which must return a
// boolean that indicates whether or not to proceed with this activity.

// Note that activities work on both client and server. You can simulate, etc

define("Activity", ["Collections"], function (Collections) {

	var processed = [];

	function process(activity) {
		using(activity.module, function (module) {
			module.processActivity.call(activity, function () {
				if (Meteor.isServer) {
					Collections.Activities.remove({_id: activity._id});
				}
			});
		});
	}

	Meteor.methods({
		pushActivity: function (activity) {
			if (typeof activity.module === "undefined") throw new Error("Must specify 'module' when pushing activity");
			if (typeof activity.data === "undefined") throw new Error("Must specify 'data' when pushing activity");

			var self = this;
			var activity, verified = true;
			var player = Meteor.users.findOne({_id: self.userId});

			using(activity.module, function (module) {
				if (typeof module.verifyActivity === "function") {
					verified = module.verifyActivity.call(self, activity, player);
				}
			});

			if (!verified) return;

			activity = _.extend({
				userId: self.userId,
				mapId: player.mapId
			}, activity);

			// Process this activity immediately for this user,
			// for both client *and* server
			process.call(self, activity);

			if (!self.isSimulation) {
				// Have the server send the activity to other users
				Collections.Activities.insert(activity);
			}
		}
	});

	if (Meteor.isClient) {
		Meteor.autorun(function () {
			var activities = Collections.Activities.find();
			activities.forEach(function (activity) {
				if (processed.indexOf(activity._id) === -1) {
					// Mark activity as having been processed
					processed.push(activity._id);

					// Process the activity client-side only, for all users
					// except the one who created the activity (it was already
					// processed for this user)
					if (activity.userId !== Meteor.userId()) {
						process(activity);
					}
				}
			});
		});
	}

});