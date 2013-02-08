define("Chat", ["Map", "Player", "Activity"], function (Map, Player, Activity) {

	var chatBubbleStayMsPerChar = 150;

	function trigger(message) {
		Meteor.call("pushActivity", {
			module: "Chat",
			data: message
		});
	}

	function prompt(caption) {
		var message = window.prompt(caption || "Enter message:");
		var player, fullMessage;

		if (message) {
			player = Meteor.user();
			fullMessage = player.username + ": " + message;

			trigger(fullMessage);
		}
	}

	function generateChatBubble(text, maxWidth) {
		var wrapped = str_wordwrap(text, maxWidth, "\n").split("\n");
		var bubble = "", i, longest = 0;

		for (i = 0; i < wrapped.length; i++) {
			longest = wrapped[i].length > longest ? wrapped[i].length : longest;
		}

		bubble += "╭" + str_repeat("─", longest) + "╮\n";
		for (i = 0; i < wrapped.length; i++) {
			bubble += "│" + str_padright(wrapped[i], longest, " ") + "│\n";
		}
		bubble += "╰─v" + str_repeat("─", longest - 2) + "╯";

		return {
			bubble: bubble,
			height: wrapped.length + 2
		}
	}

	function processActivity(next) {
		var result, pos, x, y;

		if (Meteor.isClient) {
			result = generateChatBubble(this.data, 25);
			pos = Player.getPosition(this.userId);
			x = pos.x - 2;
			y = pos.y - result.height;

			Map.layerAdd(Map.LAYER_CHATTER, x, y, result.bubble);
		}

		setTimeout(function () {
			if (Meteor.isClient) {
				Map.layerSub(Map.LAYER_CHATTER, x, y, result.bubble);
			}
			next();
		}, chatBubbleStayMsPerChar * this.data.length);
	}

	return {
		prompt: prompt,
		processActivity: processActivity
	};

});