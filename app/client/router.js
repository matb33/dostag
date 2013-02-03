Meteor.startup(function () {

	define("Router", function () {
		var AppRouter, Router;

		if (typeof Backbone !== "undefined") {
			AppRouter = Backbone.Router.extend({
				initialize: function () {
					this.bind("all", this._all);
				},
				_all: function () {
					this._trackPageview();
				},
				_trackPageview: function () {
					var url;
					if (typeof _gaq !== "undefined") {
						url = Backbone.history.getFragment();
						return _gaq.push(["_trackPageview", "/" + url]);
					}
				},
				routes: {
					"*actions": "any"
				},
				any: function (path) {
					// do nothing
				}
			});

			Router = new AppRouter;

			Backbone.history.start({pushState: true});

			return Router;
		}
	});

});