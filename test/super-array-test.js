/**
 * Created by xyaalinxsc on 19/04/15.
 */
'use strict';

var assert     = require('assert');
var SuperArray = require('../module/super-array.js');
var objects    = new SuperArray();
var array, person;

beforeEach(function () {
    objects = new SuperArray(
        {_id: 1, name: 'test1', code: 3},
        {_id: 2, name: 'test2', code: 3},
        {_id: 3, name: 'test3', code: 5}
    );

    array = new SuperArray(1,2,3,4);

    person = new SuperArray({
        name: '1',
        code: 1,
        address: {
            street: '1 rue Moyenne',
            city: {
                name: 'Bourges',
                zipcode: '18000'
            }
        }
    });
});


describe('test class SuperArray', function () {

    describe('#construct()', function () {
        it('construct with 1 number parameter', function () {
            var arr = new SuperArray(5);

            assert.equal(5, arr.length);
            assert.equal(undefined, arr[0]);
        });

        it('construct with 1 decimal parameter', function () {
            var arr = new SuperArray(2.6);

            assert.equal(1, arr.length);
            assert.equal(2.6, arr[0]);
        });

        it('construct with 1 string parameter', function () {
            var arr = new SuperArray('5');

            assert.equal(1, arr.length);
            assert.equal('5', arr[0]);
        });

        it('construct with 1 object parameter', function () {
            var arr = new SuperArray({id: 1, name: 'object'});

            assert.equal(1, arr.length);
            assert.equal('object', typeof arr[0]);
            assert.equal(1, arr[0].id);
            assert.equal('object', arr[0].name);
        });

        it('construct with 3 parameters', function () {
            var arr = new SuperArray(5,3,9);

            assert.equal(3, arr.length);
            assert.equal(5, arr[0]);
            assert.equal(3, arr[1]);
            assert.equal(9, arr[2]);
        });

        it('construct with 3 objects parameters', function () {
            var arr = new SuperArray(
                {id: 1, name: 'object1'},
                {id: 2, name: 'object2'},
                {id: 3, name: 'object3'}
            );

            assert.equal(3, arr.length);
            assert.equal(1, arr[0].id);
            assert.equal('object1', arr[0].name);
            assert.equal(2, arr[1].id);
            assert.equal('object2', arr[1].name);
            assert.equal(3, arr[2].id);
            assert.equal('object3', arr[2].name);
        });

        it('construct with array parameter', function () {
            var arr = new SuperArray([1,2,3]);

            assert.equal(3, arr.length);
            assert.equal(1, arr[0]);
            assert.equal(2, arr[1]);
            assert.equal(3, arr[2]);
        });
    });
    describe('#getBy() test by \'name\'', function () {
        it('return object if exist', function () {
            var obj = objects.getBy('name', 'test2');

            assert.equal(2, obj._id);
        });

        it('return null if not exist', function () {
            var obj = objects.getBy('name', 'foo');

            assert.equal(null, obj);
        });
    });
    describe('#getById()', function () {
        it('return object if exist', function () {
            var obj = objects.getById(3);

            assert.equal('test3', obj.name);
        });

        it('return object if not exist', function () {
            var obj = objects.getById(5);

            assert.equal(null, obj);
        });
    });
    describe('#getIndexElementBy()', function () {
        it('return object if exist', function () {
            var obj = objects.getIndexElementBy('name', 'test2');

            assert.equal(1, obj.index);
            assert.equal('test2', obj.el.name);
        });

        it('return object if not exist', function () {
            var obj = objects.getIndexElementBy('name', 'foo');

            assert.equal(null, obj);
        });
    });
    describe('#getIndexElementById()', function () {
        it('return object if exist', function () {
            var obj = objects.getIndexElementById(3);

            assert.equal(2, obj.index);
            assert.equal('test3', obj.el.name);
        });

        it('return object if not exist', function () {
            var obj = objects.getIndexElementById(5);

            assert.equal(null, obj);
        });
    });
    describe('#getAllBy()', function () {
        it('return array of object if exist', function () {
            var objs = objects.getAllBy('code', 3);

            assert.ok(objs.hasOwnProperty('length'));
            assert.equal(2, objs.length);
            assert.equal(3, objs[0].code);
        });

        it('return empty array if not exist', function () {
            var objs = objects.getAllBy('code', 4);

            assert.ok(objs.hasOwnProperty('length'));
            assert.equal(0, objs.length);
        });
    });
    describe('#removeBy() test by \'name\'', function () {
        it('remove object and return this', function () {
            var obj = objects.removeBy('name', 'test2');

            assert.equal('test2', obj.name);
            assert.equal(2, objects.length);
            assert.equal(null, objects.getBy('name', 'test2'));
        });
        it('remove nothing and return null if object not exist', function () {
            var obj = objects.removeBy('name', 'bar');

            assert.equal(obj, null);
        });
    });
    describe('#removeById()', function () {
        it('remove object and return this', function () {
            var obj = objects.removeById(1);

            assert.equal('test1', obj.name);
            assert.equal(2, objects.length);
            assert.equal(null, objects.getById(1));
        });

        it('remove nothing and return null if object not exist', function () {
            var obj = objects.removeById(5);

            assert.equal(obj, null);
        });
    });
    describe('#remove()', function () {
        it('remove a value existing and return true', function () {
            assert.ok(array.remove(1));
            assert.equal(3, array.length);
        });
        it('remove a value not existing and return boolean', function () {
            assert.equal(false, array.remove(10));
            assert.equal(4, array.length);
        });
        it('remove a object', function () {
            assert.throws(function(){array.remove({})}, Error, "value is an object !")
        });
    });
    describe('#exist()', function () {
        it('object exist element with default function', function () {
            var obj = {_id: 2, name: 'test2', code: 3};

            assert.ok(objects.exist(obj));
        });
        it('object not exist element with default function', function () {
            var obj = {_id: 2, name: 'toto', code: 3};

            assert.equal(false, objects.exist(obj));
        });
        it('object exist element with default function and disorder attribute', function () {
            var obj = {_id: 2, code: 3, name: 'test2'};

            assert.ok(objects.exist(obj));
        });
        it('object exist element with default function and attribute doesn\'t exist', function () {
            var obj = {_id: 2, code: 3};

            assert.equal(false, objects.exist(obj));
        });
        it('object exist element with custom function', function () {
            var obj = {_id: 2, name: 'test2', code: 3};

            assert.ok(objects.exist(obj, function (o1, o2) {
                return o1.name == o2.name && o1.code == o2.code;
            }));
        });
        it('object not exist element with custom function', function () {
            var obj = {_id: 2, name: 'toto', code: 3};

            assert.equal(false, objects.exist(obj, function (o1, o2) {
                return o1.name == o2.name && o1.code == o2.code;
            }));
        });
        it('object exist element with custom function and disorder attribute', function () {
            var obj = {_id: 2, code: 3, name: 'test2'};

            assert.ok(objects.exist(obj, function (o1, o2) {
                return o1.name == o2.name && o1.code == o2.code;
            }));
        });
        it('object exist with default function and default depth', function () {
            assert.ok(person.exist({
                name: '1',
                code: 1,
                address: {
                    street: '1 rue Moyenne',
                    city: {
                        name: 'Bourges',
                        zipcode: '18000'
                    }
                }
            }));
        });
        it('object not exist with default function and default depth', function () {
            assert.equal(false, person.exist({
                name: '1',
                code: 1,
                address: {
                    street: '1 rue Moyenne',
                    city: {
                        name: 'Bordeaux',
                        zipcode: '18000'
                    }
                }
            }));
        });
        it('object exist with default function and 1 depth', function () {
            person.setDepth(1);
            assert.ok(person.exist({
                name: '1',
                code: 1,
                address: {
                    street: '1 rue Moyenne',
                    city: {
                        name: 'Bordeaux',
                        zipcode: '33000'
                    }
                }
            }));
        });
        it('object exist with default 1 depth but not with default depth', function () {
            var o = {
                name: '1',
                code: 1,
                address: {
                    street: '1 rue Moyenne',
                    city: {
                        name: 'Bordeaux',
                        zipcode: '33000'
                    }
                }
            };

            person.setDepth(1);
            assert.ok(person.exist(o));
            person.setDepth();
            assert.equal(false, person.exist(o));
        });
        it('object not exist with default function and 1 depth', function () {
            person.setDepth(1);
            assert.equal(false, person.exist({
                name: '1',
                code: 1,
                address: {
                    street: '5 rue Moyenne',
                    city: {
                        name: 'Bordeaux',
                        zipcode: '33000'
                    }
                }
            }));
        });
        it('object exist with default function and 0 depth', function () {
            person.setDepth(0);
            assert.ok(person.exist({
                name: '1',
                code: 1,
                address: {
                    street: '5 rue Moyenne',
                    city: {
                        name: 'Bordeaux',
                        zipcode: '33000'
                    }
                }
            }));
        });
        it('object not exist with check Id', function () {
            var obj = {_id: 102, name: 'test2', code: 3};

            assert.equal(false, objects.exist(obj));
        });
        it('object not exist with ignore Id', function () {
            var obj = {_id: 102, name: 'test2', code: 3};

            assert.ok(objects.exist(obj, true));
        });
        it('exist with custom compare', function () {
            var obj = {_id: 102, name: 'test2', code: 3};

            assert.ok(objects.exist(obj, function (o1, o2) {
                return o1.name == o2.name;
            }));
        });
    });
});