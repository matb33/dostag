define("LayerOps", ["Sprite"], function (Sprite) {

	function mapStringToGridObject(prefix, map, targetProperty) {
		var maxLength = 0;
		var grid = {}, x, y, line, lineLength, key;
		var lines = map.split(/\r\n|\r|\n/g);
		var ret = {};

		for (y = 0; y < lines.length; y++) {
			lineLength = lines[y].length;
			maxLength = lineLength > maxLength ? lineLength : maxLength;
		}

		for (y = 0; y < lines.length; y++) {
			line = lines[y];
			lineLength = line.length;
			for (x = 0; x < maxLength; x++) {
				key = prefix + y + "_" + x;
				if (x < lineLength) {
					grid[key] = line.charAt(x);
				} else {
					grid[key] = " ";
				}
			}
		}

		ret = {
			width: maxLength,
			height: y
		};

		if (targetProperty) {
			ret[targetProperty] = grid;
		} else {
			ret = _.extend(ret, grid);
		}

		return ret;
	}

	function generateNullGridObject(prefix, w, h) {
		var grid = {};
		for (y = 0; y < h; y++) {
			for (x = 0; x < w; x++) {
				grid[prefix + y + "_" + x] = null;
			}
		}
		return grid;
	}

	function add(prefix, sx, sy, text, target) {
		var x, y, c, result = mapStringToGridObject("", text, "grid");
		target = target || {};

		for (y = sy; y < sy + result.height; y++) {
			for (x = sx; x < sx + result.width; x++) {
				c = result.grid[(y - sy) + "_" + (x - sx)];
				if (c !== Sprite.Map.TRANSPARENT) {
					target[prefix + y + "_" + x] = c;
				}
			}
		}

		return target;
	}

	function sub(prefix, sx, sy, text, target) {
		var x, y, c, result = mapStringToGridObject("", text, "grid");
		target = target || {};

		for (y = sy; y < sy + result.height; y++) {
			for (x = sx; x < sx + result.width; x++) {
				c = result.grid[(y - sy) + "_" + (x - sx)];
				if (c !== Sprite.Map.TRANSPARENT) {
					target[prefix + y + "_" + x] = null;
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