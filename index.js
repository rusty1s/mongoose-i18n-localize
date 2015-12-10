/* jshint node: true */
'use strict';

module.exports = function(schema, options) {
	var addLocales = function(pathname, schema) {
		var instance = schema.paths[pathname].instance;
		var config = schema.paths[pathname].options;

		if (config.i18n && instance === 'String') {
			delete(config.i18n);
			schema.remove(pathname);

			options.locales.forEach(function(locale) {
				schema.path(pathname + '.' + locale, config);
			});
		}
	};

	var recursiveIteration = function(schema) {
		for (var key in schema.paths) {
			if (schema.paths[key].schema) recursiveIteration(schema.paths[key].schema);
			else addLocales(schema.paths[key].path, schema);
		}
	};

	if (options && options.locales instanceof Array && options.locales.length > 0) recursiveIteration(schema);

	var localize = function(obj, locale, toJSON) {
		var addLocalized = function(obj) {
			for (var key in obj) {
				if (key === '_id') continue;
				else if (typeof obj[key] === 'object') addLocalized(obj[key]);
				else if (key === locale) obj.localized = obj[key];
			}
			return obj;
		};

		if (obj instanceof Array) return obj.map(function(object) {
			return addLocalized(toJSON ? object.toJSON() : object.toObject(), locale);
		});
		else return addLocalized(toJSON ? obj.toJSON() : obj.toObject(), locale);
	};

	schema.methods.toJSONLocalized = function(obj, locale) {
		return localize(obj, locale, true);
	};

	schema.methods.toObjectLocalized = function(obj, locale) {
		return localize(obj, locale, false);
	};
};
