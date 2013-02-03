define("Votes", ["ServerTime"], function (ServerTime) {

	var collection = new Meteor.Collection("votes");

	function insert(firstname, lastname, email, answer) {
		var vote = collection.findOne({email: email, tweet_id: answer.data.id});
		var id;
		if (!vote) {
			id = collection.insert({
				created: ServerTime.getTimeMs(),
				firstname: firstname,
				lastname: lastname,
				email: email,
				contest_slug: answer.contest_slug,
				tweet_id: answer.data.id,
				answer_id: answer.__originalId || answer._id,
				disqualified: false,
				drawn: false
			});
		}

		return id;
	}

	function update(id, properties) {
		return collection.update({_id: id}, {$set: properties});
	}

	function getVotes() {
		return collection.find({}, {sort: {created: 1}});
	}

	function getVotesForContest(contest, drawn) {
		return collection.find({contest_slug: contest.slug, drawn: !!drawn}, {sort: {created: 1}});
	}

	function getVoteForContest(contest, index, drawn) {
		return collection.findOne({contest_slug: contest.slug, drawn: !!drawn}, {skip: index});
	}

	function getVotesForAnswer(answer, drawn) {
		return collection.find({answer_id: answer._id, drawn: !!drawn}, {sort: {created: 1}});
	}

	function getRandomVote(contest, drawn) {
		var randomIndex;
		var numVotes = getNumberOfVotes(contest, drawn);

		if (numVotes > 0) {
			randomIndex = _.random(0, numVotes - 1);
			return getVoteForContest(contest, randomIndex, drawn);
		}
	}

	function getNumberOfVotes(contest, drawn) {
		var votes = getVotesForContest(contest, drawn);
		if (votes) {
			return votes.count();
		}
		return 0;
	}

	function markVoteAsDrawn(vote) {
		update(vote._id, {drawn: true});
	}

	if (Meteor.isServer) {
		Meteor.methods({
			insertVote: insert
		});

		// Allow admin user to modify votes from the client
		collection.allow({
			insert: function (userId) { return !!userId; },
			update: function (userId) { return !!userId; },
			remove: function (userId) { return !!userId; }
		});

		ensureIndex(collection, "votes", {"created": 1});
	}

	return {
		collection: collection,
		getVotes: getVotes,
		getVotesForContest: getVotesForContest,
		getVoteForContest: getVoteForContest,
		getVotesForAnswer: getVotesForAnswer,
		getRandomVote: getRandomVote,
		markVoteAsDrawn: markVoteAsDrawn,
		getNumberOfVotes: getNumberOfVotes
	};

});