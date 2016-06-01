var assert = require('assert');
var SafePromise = require('../dist/index').default;

describe('SafePromise test', () => {

	it('should propagate values', (done) => {
		function f1(a) {
			return new SafePromise((resolve, reject) => {
				setTimeout(() => {
					resolve(a);
				}, 10)
			});
		}


		function f2(base) {
			return new SafePromise((resolve, reject) => {
				setTimeout(() => {
					resolve(base*2);
				}, 10)
			});
		}

		f1(3)
			.then(f2)
			.then((result) => {
				try {
					assert.equal(result, 6);
					done();
				} catch(e) {
					done(e);
				}
			});	
	});

});
