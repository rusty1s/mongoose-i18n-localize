/* jshint node: true */
'use strict';

var _ = require('lodash');

module.exports = function(schema, options) {
	options = options || {
		locales: ['en', 'de']
	};

	if (!(options.locales && _.isArray(options.locales) && options.locales.length > 0)) throw 'You must pass an array of locales as an options!';

	options.locales = _.uniq(options.locales);

	schema.eachPath(function(path, config) {
		if (config.options.i18n) {
			delete(config.options.i18n);
			schema.remove(path);

			options.locales.forEach(function(locale) {
				schema.path(path + '.' + locale, config.options);
			});
		}
	});

	var translate = function(obj, locale, toJSON) {
		if (options.locales.indexOf(locale) === -1) throw 'You must pass a valid locale';

		var addI18n = function(obj) {
			for (var key in obj) {
				if (key === '_id') continue;
				else if (_.isObject(obj[key])) addI18n(obj[key]);
				else if (key === locale) obj.localized = obj[key];
			}
			return obj;
		};

		if (_.isArray(obj)) return obj.map(function(object) {
			return addI18n(toJSON ? object.toJSON() : object.toObject(), locale);
		});
		else return addI18n(toJSON ? obj.toJSON() : obj.toObject(), locale);
	};

	schema.methods.toJSONTranslated = function(obj, locale) {
		return translate(obj, locale, true);
	};

	schema.methods.toObjectTranslated = function(obj, locale) {
		return translate(obj, locale, false);
	};
};
