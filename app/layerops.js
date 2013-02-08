define("LayerOps", ["Sprite"], function (Sprite) {

	function mapStringToGridObject(map) {
		var maxLength = 0;
		var grid = {}, x, y, line, lineLength, key;
		var lines = map.split(/\r\n|\r|\n/g);

		for (y = 0; y < lines.length; y++) {
			lineLength = lines[y].length;
			maxLength = lineLength > maxLength ? lineLength : maxLength;
		}

		for (y = 0; y < lines.length; y++) {
			line = lines[y];
			lineLength = line.length;
			for (x = 0; x < maxLength; x++) {
				key = y + "_" + x;
				if (x < lineLength) {
					grid[key] = line.charAt(x);
				} else {
					grid[key] = " ";
				}
			}
		}

		return {
			grid: grid,
			width: maxLength,
			height: y
		};
	}

	function generateNullGridObject(w, h) {
		var grid = {};
		for (y = 0; y < h; y++) {
			for (x = 0; x < w; x++) {
				grid[y + "_" + x] = null;
			}
		}
		return grid;
	}

	function add(sx, sy, text, target, force) {
		var x, y, c, result = mapStringToGridObject(text);
		if (target) {
			for (y = sy; y < sy + result.height; y++) {
				for (x = sx; x < sx + result.width; x++) {
					c = result.grid[(y - sy) + "_" + (x - sx)];
					if (c !== Sprite.Map.TRANSPARENT) {
						target[y + "_" + x] = c;
					}
				}
			}
		}
		return target;
	}

	function sub(sx, sy, text, target, force) {
		var x, y, c, result = mapStringToGridObject(text);
		if (target) {
			for (y = sy; y < sy + result.height; y++) {
				for (x = sx; x < sx + result.width; x++) {
					c = result.grid[(y - sy) + "_" + (x - sx)];
					if (c !== Sprite.Map.TRANSPARENT) {
						target[y + "_" + x] = null;
					}
				}
			}
		}
		return target;
	}

	return {
		add: add,
		sub: sub,
		mapStringToGridObject: mapStringToGridObject,
		generateNullGridObject: generateNullGridObject
	};

});