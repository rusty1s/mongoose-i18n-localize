/* jshint node: true */
'use strict';
function ArrNoDupe(a) {
    var temp = {}, r = [], i = 0, k;
    for (i ; i < a.length; i++) {temp[a[i]] = true;}
    for (k in temp){ temp.hasOwnProperty(k) && r.push(k); }
    return r;
}
module.exports = function(schema, options) {
	var options_locales = ArrNoDupe(options.locales||[])
	;
	var addLocales = function(pathname, schema) {
		var instance = schema.paths[pathname].instance;
		var config = schema.paths[pathname].options;

		if (config.i18n && (instance === 'String' || instance === 'Date')) {
			delete(config.i18n);
			schema.remove(pathname);

			options_locales.forEach(function(locale) {
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

	if (options && options_locales instanceof Array && options_locales.length > 0) recursiveIteration(schema);

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
		var ret;
		if (typeof obj === 'object') {
			ret = localize(obj, locale, true);
		} else if (typeof obj === 'string' && this.hasOwnProperty('isNew')) {
			ret = localize(this, obj, true);
		}
		return ret;
	};

	schema.methods.toObjectLocalized = function(obj, locale) {
		var ret;
		if (typeof obj === 'object') {
			ret = localize(obj, locale, false);
		} else if (typeof obj === 'string' && this.hasOwnProperty('isNew')) {
			ret = localize(this, obj, false);
		}
		return ret;
	};
	
	var localizeOnly = function(obj, locale, localeDefault, toJSON) {
		var addLocalized = function(obj) {
			for (var key in obj) {
				if (key === '_id') continue;
				else if (typeof obj[key] === 'object' && !(obj[key] instanceof Date)) {
					addLocalized(obj[key]);
					if(obj[key] && obj[key].localized !== undefined) {
						obj[key] = obj[key].localized;
					} else if(localeDefault && obj[key] && obj[key].default !== undefined) {
						obj[key] = obj[key].default;
					}
				}
				else if (key === locale) obj.localized = obj[key];
				else if (localeDefault && key === localeDefault) obj.default = obj[key];
			}
			return obj;
		};

		if (obj instanceof Array) return obj.map(function(object) {
			return addLocalized(toJSON ? object.toJSON() : object.toObject(), locale);
		});
		else return addLocalized(toJSON ? obj.toJSON() : obj.toObject(), locale);
	};

	schema.methods.toJSONLocalizedOnly = function(obj, locale, localeDefault) {
		var ret;
		if (typeof obj === 'object') {
			ret = localizeOnly(obj, locale, localeDefault, true);
		} else if (typeof obj === 'string' && this.hasOwnProperty('isNew')) {
			ret = localizeOnly(this, obj, locale, true);
		}
		return ret;
	};

	schema.methods.toObjectLocalizedOnly = function(obj, locale, localeDefault) {
		var ret;
		if (typeof obj === 'object') {
			ret = localizeOnly(obj, locale, localeDefault, false);
		} else if (typeof obj === 'string' && this.hasOwnProperty('isNew')) {
			ret = localizeOnly(this, obj, locale, false);
		}
		return ret;
	};
};
