define("ServerTime", ["SyncObject"], function (SyncObject) {

	var sync = new SyncObject("serverTime");
	var intervalId;

	function updateTime() {
		sync.set({ms: Date.now()});
	}

	function updateInterval(intervalMs) {
		Meteor.clearInterval(intervalId);
		intervalId = Meteor.setInterval(updateTime, intervalMs);
		updateTime();
	}

	function getTimeMs() {
		var obj = sync.get();
		return obj ? obj.ms : Date.now();
	}

	if (Meteor.isServer) {
		sync.bind(function (intervalMs) {
			updateInterval(intervalMs);
		});
	}

	if (Meteor.isClient) {
		sync.bind(1000);
	}

	return {
		getTimeMs: getTimeMs
	};

});