/* jshint node: true, mocha: true */
'use strict';

var mongoose = require('mongoose');
var should = require('should');

var helper = require('../helper');
var mongooseI18n = require('../../index');

module.exports = function() {

	describe('I18n', function() {
		afterEach(helper.afterEach);

		it('should store i18n fields', function(done) {
			var Model = mongoose.model('I18nSchema', helper.createI18nSchema().plugin(mongooseI18n, {
				locales: ['en', 'de']
			}));

			var model = new Model({
				name: {
					en: 'hello',
					de: 'hallo',
					fr: 'bonjour'
				}
			});

			model.name.en.should.equal('hello');
			model.name.de.should.equal('hallo');
			should.not.exist(model.name.fr);

			var json = Model.schema.methods.toJSONLocalized(model, 'de');
			json.name.en.should.equal('hello');
			json.name.de.should.equal('hallo');
			json.name.localized.should.equal('hallo');

			json = Model.schema.methods.toJSONLocalized(model, 'fr');
			json.name.en.should.equal('hello');
			json.name.de.should.equal('hallo');
			should.not.exist(json.name.localized);

			var obj = Model.schema.methods.toObjectLocalized(model, 'en');
			obj.name.en.should.equal('hello');
			obj.name.de.should.equal('hallo');
			obj.name.localized.should.equal('hello');

			obj = Model.schema.methods.toObjectLocalized(model, 'fr');
			obj.name.en.should.equal('hello');
			obj.name.de.should.equal('hallo');
			should.not.exist(obj.name.localized);

			done();
		});

		it('should store i18n fields in nested object', function(done) {
			var Model = mongoose.model('I18nNestedObjectSchema', helper.createI18nNestedObjectSchema().plugin(mongooseI18n, {
				locales: ['en', 'de']
			}));

			var model = new Model({
				nested: {
					name: {
						en: 'hello',
						de: 'hallo'
					}
				}
			});

			model.nested.name.en.should.equal('hello');
			model.nested.name.de.should.equal('hallo');

			var json = Model.schema.methods.toJSONLocalized(model, 'de');
			json.nested.name.en.should.equal('hello');
			json.nested.name.de.should.equal('hallo');
			json.nested.name.localized.should.equal('hallo');

			var obj = Model.schema.methods.toObjectLocalized(model, 'en');
			obj.nested.name.en.should.equal('hello');
			obj.nested.name.de.should.equal('hallo');
			obj.nested.name.localized.should.equal('hello');

			done();
		});

		it('should store i18n fields in nested array', function(done) {
			var Model = mongoose.model('I18nNestedArraySchema', helper.createI18nNestedArraySchema().plugin(mongooseI18n, {
				locales: ['en', 'de']
			}));

			var model = new Model({
				nested: [{
					name: {
						en: 'hello',
						de: 'hallo'
					}
				}, {
					name: {
						en: 'bye',
						de: 'auf wiedersehen'
					}
				}]
			});

			model.nested[0].name.en.should.equal('hello');
			model.nested[0].name.de.should.equal('hallo');
			model.nested[1].name.en.should.equal('bye');
			model.nested[1].name.de.should.equal('auf wiedersehen');

			var json = Model.schema.methods.toJSONLocalized(model, 'de');
			json.nested[0].name.en.should.equal('hello');
			json.nested[0].name.de.should.equal('hallo');
			json.nested[0].name.localized.should.equal('hallo');
			json.nested[1].name.en.should.equal('bye');
			json.nested[1].name.de.should.equal('auf wiedersehen');
			json.nested[1].name.localized.should.equal('auf wiedersehen');

			var obj = Model.schema.methods.toObjectLocalized(model, 'en');
			obj.nested[0].name.en.should.equal('hello');
			obj.nested[0].name.de.should.equal('hallo');
			obj.nested[0].name.localized.should.equal('hello');
			obj.nested[1].name.en.should.equal('bye');
			obj.nested[1].name.de.should.equal('auf wiedersehen');
			obj.nested[1].name.localized.should.equal('bye');

			done();
		});

		it('should store i18n fields in nested nested array', function(done) {
			var Model = mongoose.model('I18nNestedNestedArraySchema', helper.createI18nNestedNestedArraySchema().plugin(mongooseI18n, {
				locales: ['en', 'de']
			}));

			var model = new Model({
				nested: [{
					nested: [{
						name: {
							en: 'hello',
							de: 'hallo'
						}
					}, {
						name: {
							en: 'bye',
							de: 'auf wiedersehen'
						}
					}]
				}]
			});

			model.nested[0].nested[0].name.en.should.equal('hello');
			model.nested[0].nested[0].name.de.should.equal('hallo');
			model.nested[0].nested[1].name.en.should.equal('bye');
			model.nested[0].nested[1].name.de.should.equal('auf wiedersehen');

			var json = Model.schema.methods.toJSONLocalized(model, 'de');
			json.nested[0].nested[0].name.en.should.equal('hello');
			json.nested[0].nested[0].name.de.should.equal('hallo');
			json.nested[0].nested[0].name.localized.should.equal('hallo');
			json.nested[0].nested[1].name.en.should.equal('bye');
			json.nested[0].nested[1].name.de.should.equal('auf wiedersehen');
			json.nested[0].nested[1].name.localized.should.equal('auf wiedersehen');

			var obj = Model.schema.methods.toObjectLocalized(model, 'en');
			obj.nested[0].nested[0].name.en.should.equal('hello');
			obj.nested[0].nested[0].name.de.should.equal('hallo');
			obj.nested[0].nested[0].name.localized.should.equal('hello');
			obj.nested[0].nested[1].name.en.should.equal('bye');
			obj.nested[0].nested[1].name.de.should.equal('auf wiedersehen');
			obj.nested[0].nested[1].name.localized.should.equal('bye');

			done();
		});
	});

	it('should store i18n fields in nested schema', function(done) {
		var Model = mongoose.model('I18nNestedSchema', helper.createI18nNestedSchema().plugin(mongooseI18n));

		var model = new Model({
			nested: {
				name: {
					en: 'hello',
					de: 'hallo'
				}
			}
		});

		model.nested.name.en.should.equal('hello');
		model.nested.name.de.should.equal('hallo');

		var json = Model.schema.methods.toJSONLocalized(model, 'de');
		json.nested.name.en.should.equal('hello');
		json.nested.name.de.should.equal('hallo');
		json.nested.name.localized.should.equal('hallo');

		var obj = Model.schema.methods.toObjectLocalized(model, 'en');
		obj.nested.name.en.should.equal('hello');
		obj.nested.name.de.should.equal('hallo');
		obj.nested.name.localized.should.equal('hello');

		done();
	});

	it('should store i18n fields in nested schema array', function(done) {
		var Model = mongoose.model('I18nNestedSchemaArray', helper.createI18nNestedSchemaArray().plugin(mongooseI18n));

		var model = new Model({
			nested: [{
				name: {
					en: 'hello',
					de: 'hallo'
				}
			}]
		});

		model.nested[0].name.en.should.equal('hello');
		model.nested[0].name.de.should.equal('hallo');

		var json = Model.schema.methods.toJSONLocalized(model, 'de');
		json.nested[0].name.en.should.equal('hello');
		json.nested[0].name.de.should.equal('hallo');
		json.nested[0].name.localized.should.equal('hallo');

		var obj = Model.schema.methods.toObjectLocalized(model, 'en');
		obj.nested[0].name.en.should.equal('hello');
		obj.nested[0].name.de.should.equal('hallo');
		obj.nested[0].name.localized.should.equal('hello');

		done();
	});

	it('should adopt validation for every i18n field', function(done) {
		var Model = mongoose.model('I18nValidationSchema', helper.createI18nValidationSchema().plugin(mongooseI18n, {
			locales: ['en', 'de']
		}));

		new Model().save(function(err) {
			should.exist(err);
			err.errors['name.en'].kind.should.equal('required');
			err.errors['name.de'].kind.should.equal('required');

			new Model({
				name: {
					en: 'a',
					de: '123'
				}
			}).save(function(err) {
				should.exist(err);
				err.errors['name.en'].kind.should.equal('minlength');
				err.errors['name.de'].kind.should.equal('user defined');

				new Model({
					name: {
						en: 'abc',
						de: 'abc'
					}
				}).save(function(err) {
					should.not.exist(err);

					new Model({
						name: {
							en: 'abc',
							de: 'def'
						}
					}).save(function(err) {
						should.exist(err);
						err.message.should.match(/dup key/);
						err.message.should.match(/name.en/);

						done();
					});
				});
			});
		});
	});
};
