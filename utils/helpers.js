const bcryptJs = require("bcryptjs");

/**
 * Object item getter handler func
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const objGetter = (object, keys) => {
	return keys.reduce((obj, key) => {
		if (object && Object.prototype.hasOwnProperty.call(object, key)) {
			obj[key] = object[key];
		}
		return obj;
	}, {});
};

/**
 * unwanted obj item remover handler func
 * @param {Object} object
 * @param {String[]} keys
 * @returns {Object}
 */
const objSelective = (object, keys) => {
	return keys.reduce((obj, key) => {
		if (object) {
			if (Object.prototype.hasOwnProperty.call(object, key)) delete obj[key];
		}
		return obj;
	}, object);
};

/**
 * string match against hash handler func
 * @param {String} string
 * @param {String} hash
 * @returns {bool}
 */
const stringHashMatch = async (string, hash) => {
	return await bcryptJs.compareSync(string, hash);
};

/**
 * set ip to locals handler func
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const setCustomProps = (req, res, next) => {
	// define custom instance
	req.custom = {};
	// pass req ip prop
	req.custom.reqIp =
		req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
	next();
};

module.exports = {
	objGetter,
	objSelective,
	stringHashMatch,
	setCustomProps,
};
