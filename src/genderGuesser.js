const https = require('https');

/**
 * Takes a list of names,limited to 9 names, and returns the gender for each
 * one. e.g. name = ['John', 'Anna', 'David'] Returns the genderised names in
 * the order they have been passed in. The API follows ISO 3166-1 for country
 * codes.
 * In case of an error of ANY kind, this method will return an empty list.
 */
const genderise = (nameArr, countryCode, apiKey) => {
    return new Promise((resolve, reject) => {
        if (nameArr.length > 9 || nameArr.length < 1) {
            console.log('Input array length must be between 0 and 9: ', nameArr);
            resolve([]);
        }
        const queryString = constructQueryString(nameArr, countryCode, apiKey);
        https.get(`https://api.genderize.io/?${queryString}`, res => {
            const { statusCode } = res;
            if (statusCode !== 200) {
                console.log('genderizer.io error: ', res);
                resolve([]);
            }

            let rawData = '';
            res.on('data', chunk => rawData += chunk);
            res.on('end', () => {
                const parsedData = JSON.parse(rawData);
                return resolve(parsedData);
            });
        }).on('error', err => {
            console.log('genderizer.io error: ', err);
            resolve([]);
        });
    });
};

const constructQueryString = (nameArr, countryCode, apiKey) => {
    const nameString = nameArr.reduce((accumulator, current, index) => `${accumulator}&name[${index}]=${current}`, '').substr(1);
    const countryString = countryCode ? `&country_id=${countryCode}` : '';
    const apiString = apiKey ? `&apiKey=${apiKey}` : '';
    return `${nameString}${countryString}${apiString}`
};

const guessTitle = async firstName => {
    const genderResult = await genderise([firstName]);
    return genderResult.length > 0
        ? genderResult[0].gender === 'female' ? 'Ms' : 'Mr'
        : 'Mr';
};

module.exports = {
    genderise,
    constructQueryString,
    guessTitle
}