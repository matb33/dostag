define("Chat", ["Map", "Player"], function (Map, Player) {

	if (Meteor.isClient) {
		return (function () {

			var chatBubbleStayMsPerChar = 150;

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

			function prompt() {
				var message = window.prompt("Say what?");
				var player, fullMessage, result, pos, context, x, y;

				if (message) {
					// Translate the message directly into a rendering and add
					// it to the map's dedicated chatter layer
					player = Meteor.user();
					fullMessage = player.username + ": " + message;
					result = generateChatBubble(fullMessage, 25);
					pos = Player.getPosition();
					context = {userId: player._id};
					x = pos.x - 2;
					y = pos.y - result.height;

					Map.layerAdd.call(context, "chatter", x, y, result.bubble);

					Meteor.setTimeout(function () {
						Map.layerSub.call(context, "chatter", x, y, result.bubble);
					}, chatBubbleStayMsPerChar * fullMessage.length);
				}
			}

			return {
				prompt: prompt
			};

		})();
	}

});