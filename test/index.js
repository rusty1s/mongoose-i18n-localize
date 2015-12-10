/* jshint node: true, mocha: true */
'use strict';

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongoose-i18n-localize');
mongoose.connection.on('error', function() {
	throw new Error('Unable to connect to database.');
});

describe('Mongoose I18n Localize', function() {
	require('./tests/i18n')();
});
