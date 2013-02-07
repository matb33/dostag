using("Renderer", function (Renderer) {

	Template.viewport.render = function () {
		return Renderer.getRenderedMap();
	};

});