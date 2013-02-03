define("SyncObject", function () {

	return function (name, allow) {

		var self = this;
		var collectionName = "SyncObject_" + name;
		var subName = "SyncObjectSub_" + name;

		function subscribe(/* optional parameters */) {
			if (Meteor.isClient) {
				Meteor.subscribe.apply(self, [subName].concat(Array.prototype.slice.call(arguments)));
			}
		}

		function publish(callback) {
			if (Meteor.isServer) {
				Meteor.startup(function () {
					Meteor.publish(subName, function (/* parameters */) {
						if (typeof callback === "function") {
							callback.apply(self, Array.prototype.slice.call(arguments));
						}
						return self.collection.find();
					});
				});

				// Default permissions are server-only access
				allow({
					insert: function () { return false; },
					update: function () { return false; },
					remove: function () { return false; }
				});
			}
		}

		function set(obj) {
			var doc = self.collection.findOne();
			if (doc) {
				return self.collection.update({_id: doc._id}, {$set: obj});
			} else {
				return self.collection.insert(obj);
			}
		}

		function get() {
			return self.collection.findOne();
		}

		function allow(rules) {
			self.collection.allow(rules);
		}

		function deny(rules) {
			self.collection.deny(rules);
		}

		self.collection = new Meteor.Collection(collectionName);

		if (Meteor.isServer) {
			return {
				bind: publish,
				publish: publish,
				set: set,
				get: get,
				allow: allow,
				deny: deny
			};
		}

		if (Meteor.isClient) {
			return {
				bind: subscribe,
				subscribe: subscribe,
				set: set,
				get: get
			};
		}
	};

});