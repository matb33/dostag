define("LayerOps", ["Sprite"], function (Sprite) {

	function mapStringToGridObject(map, targetProperty) {
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
				key = y + "_" + x;
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

	function generateNullGridObject(w, h) {
		var grid = {};
		for (y = 0; y < h; y++) {
			for (x = 0; x < w; x++) {
				grid[y + "_" + x] = null;
			}
		}
		return grid;
	}

	function add(sx, sy, text, optTarget, optUserId) {
		var x, y, c, data, result = mapStringToGridObject(text, "grid");
		var target = optTarget || {};

		for (y = sy; y < sy + result.height; y++) {
			for (x = sx; x < sx + result.width; x++) {
				c = result.grid[(y - sy) + "_" + (x - sx)];
				if (c !== Sprite.Map.TRANSPARENT) {
					data = optUserId ? {u: optUserId, c: c} : c;
					target[y + "_" + x] = data;
				}
			}
		}

		return target;
	}

	function sub(sx, sy, text, target) {
		var x, y, c, result = mapStringToGridObject(text, "grid");
		target = target || {};

		for (y = sy; y < sy + result.height; y++) {
			for (x = sx; x < sx + result.width; x++) {
				c = result.grid[(y - sy) + "_" + (x - sx)];
				if (c !== Sprite.Map.TRANSPARENT) {
					target[y + "_" + x] = null;
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