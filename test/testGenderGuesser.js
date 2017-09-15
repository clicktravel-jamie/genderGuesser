const { genderise, constructQueryString, guessTitle } = require('../src/genderGuesser');
const { assert } = require('chai');
const nock = require('nock');

const nockMaleResponse = [{'name':'Thomas', 'gender':'male'}];
const nockFemaleResponse = [{'name':'Lily', 'gender':'female'}];
const nockLocalisedResponse = [{'name':'Jamie', 'gender':'male'}];
const nockMixedResponse = [{'name':'Danielle', 'gender':'female'}, {'name':'Jack', 'gender':'male'}];

nock('https://api.genderize.io')
    .get('/')
    .query({ name: [ 'Thomas' ] })
    .times(2)
    .reply(200, nockMaleResponse)
    .get('/')
    .query({ name: [ 'Lily' ] })
    .times(2)
    .reply(200, nockFemaleResponse)
    .get('/')
    .query({ name: [ 'mmm' ] })
    .reply(200, [])
    .get('/')
    .query({ name: [ 'Danielle', 'Jack' ] })
    .reply(200, nockMixedResponse)
    .get('/')
    .query({ 'name': [ 'Jamie' ], 'country_id': 'GB', 'apiKey': '1234' })
    .reply(200, nockLocalisedResponse)
    .get('/')
    .query({ name: [ 'ErrorStatus' ] })
    .reply(500, { error: 'Error 500'});

describe('Gender Guesser', () => {
    describe('Genderise', () => {
        it('Should return genderize.io response for Thomas', async () => {
            const input = ['Thomas'];
            const actual = await genderise(input);

            assert.deepEqual(nockMaleResponse, actual);
        });
        it('Should return genderize.io response for Lily', async () => {
            const input = ['Lily'];
            const actual = await genderise(input);
            assert.deepEqual(nockFemaleResponse, actual);
        });
        it('Should return genderize.io response for multiple names', async () => {
            const input = ['Danielle', 'Jack'];
            const actual = await genderise(input);
            assert.deepEqual(nockMixedResponse, actual);
        });
        it('Should return genderize.io response if passed a country code and api key', async () => {
            const input = [['Jamie'], 'GB', '1234'];
            const actual = await genderise(...input);
            assert.deepEqual(nockLocalisedResponse, actual);
        });
        it('Should return an empty array for an array larger than 9', async () => {
            const input = Array(10).fill('Bob');
            const expected = [];
            const actual = await genderise(input);
            assert.deepEqual(expected, actual);
        });
        it('Should return an empty array for an empty input array', async () => {
            const input = [];
            const actual = await genderise(input);
            const expected = [];
            assert.deepEqual(expected, actual);
        });
        it('Should return an empty array when genderize.io returns an error', async () => {
            const input = ['ErrorStatus'];
            const actual = await genderise(input);
            const expected = [];
            assert.deepEqual(expected, actual);
        });
    });
    describe('Construct Gender Query', () => {
        it('Should add a single name to a correctly formatted query string', () => {
            const input = ['Thomas'];
            const expected = 'name[0]=Thomas';
            const actual = constructQueryString(input);
            assert.strictEqual(expected, actual);
        });
        it('Should add multiple names to a correctly formatted query string', () => {
            const input = ['Thomas', 'Henry'];
            const expected = 'name[0]=Thomas&name[1]=Henry';
            const actual = constructQueryString(input);
            assert.strictEqual(expected, actual);
        });
        it('Should add an apikey to the query string if provided', () => {
            const input = [['Thomas', 'Henry'], '', '1234'];
            const expected = 'name[0]=Thomas&name[1]=Henry&apiKey=1234';
            const actual = constructQueryString(...input);
            assert.strictEqual(expected, actual);
        });
    });
    describe('Guess Title', () => {
        it('should return Ms for Lily', async () => {
            const actual = await guessTitle('Lily');
            const expected = 'Ms';
            assert.equal(actual, expected);
        });
        it('should return Mr for Thomas', async () => {
            const actual = await guessTitle('Thomas');
            const expected = 'Mr';
            assert.equal(actual, expected);
        });
        it('should return Mr for an unrecognised name', async () => {
            const actual = await guessTitle('mmm');
            const expected = 'Mr';
            assert.equal(actual, expected);
        });
    })
});
