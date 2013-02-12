using("Stats", function (Stats) {

	Template.leaderboard.topKills = function () {
		return Stats.getTopKills(5);
	};

	Template.leaderboard.topDeaths = function () {
		return Stats.getTopDeaths(5);
	};

});