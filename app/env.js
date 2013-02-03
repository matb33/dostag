define("Env", function () {

	var Env = {};

	Env.isDevelopment = (function () {
		if (Meteor.isClient) {
			return window.location.hostname.indexOf("localhost") !== -1;
		} else {
			if (process.env.ROOT_URL) {
				return process.env.ROOT_URL.indexOf("localhost") !== -1;
			} else {
				return process.env.NODE_ENV !== "production";
			}
		}
	})();

	Env.isProduction = !Env.isDevelopment;

	return Env;

});