const cryptoHash = require('./crypto-hash');

describe('cryptohash()', () => {
    it('should return sha-256 hash of foo', () => {
        expect(cryptoHash('foo')).toEqual('b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b');
    });

    it('produces same hash for differently added arguments', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'one', 'two'));
    });

    it('produces a unique hash when the properties have changed on an input', () => {
        const foo = {};
        const originalHash = cryptoHash(foo);
        foo['a'] ='a';
        expect(cryptoHash(foo)).not.toEqual(originalHash);
    });
});