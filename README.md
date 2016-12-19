# mongoose-i18n-localize

mongoose-i18n-localize is a mongoose plugin to support i18n and localization in your mongoose schemas.

It seems like [mongoose-i18n](https://github.com/elrolito/mongoose-i18n) is not longer supported and I didn't get it to work on my machine, so I decided to write my own version.

## Usage

```
npm install mongoose-i18n-localize
```

Create your schema:

```js
var mongoose = require('mongoose');
var mongooseI18n = require('mongoose-i18n-localize');

var schema = new mongoose.Schema({
	name: {
		type: String,
		i18n: true
	}
});

schema.plugin(mongooseI18n, {
	locales: ['en', 'de']
});

var Model = mongoose.model('Name', schema);
```

This will create a structure like:

```js
{
	name: {
		en: String,
		de: String
	}
}
```

All validators of `name` get also assigned to `name.en` and `name.de`.

mongoose-i18n-localize adds the methods `toObjectLocalized(resource, locale)` and `toJSONLocalized(resource, locale)` to the i18n schema methods. To set the locale of a resource to `en`, just do:


```js
Model.find(function(err, resources) {
	var localizedResources = resources.toJSONLocalized('en');
});

//or

Model.find(function(err, resources) {
	var localizedResources = Model.schema.methods.toJSONLocalized(resources, 'en');
});
```

`localizedResources` has now the following structure:

```js
[
	{
		name: {
			en: 'hello',
			de: 'hallo',
			localized: 'hello'
		}
	}
]
```

Use `toObjectLocalized` or `toJSONLocalized` according to `toObject` or `toJSON`.

If you only want to show only one locale message use the methods
`toObjectLocalizedOnly(resource, locale, localeDefault)` or
`toJSONLocalizedOnly(resource, locale, localeDefault)`.

# Tests

To run the tests you need a local MongoDB instance available. Run with:

```
npm test
```
# Issues

Please use the GitHub issue tracker to raise any problems or feature requests.

If you would like to submit a pull request with any changes you make, please feel free!
