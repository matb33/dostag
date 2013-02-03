using("Env", function (Env) {

	if (Env.isDevelopment) {
		__meteor_runtime_config__.ROOT_URL = "http://localhost:3000";
	} else {
		__meteor_runtime_config__.ROOT_URL = "http://dostag.meteor.com";
	}

});