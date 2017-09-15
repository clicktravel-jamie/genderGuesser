# Gender Guesser

This module uses genderize.io to work out genders based on a first name.  Takes a list of names,limited to 9 names, and returns the gender for each one. e.g. name = ['John', 'Anna', 'David'] Returns the genderised names in the order they have been passed in. In case of an error of ANY kind, this method will return an empty list.

## Genderise

The `genderise` function returns a promise, so you can use `await` or `.then` to get the result asyncronously.

### Input

* Name array: This must be an array of 9 elements or fewer.
* _(optional)_ A country code can also be passed in to get results based on a specified country.  The API follows ISO 3166-1 for country codes.  
* _(optional)_ An apiKey can also be entered if you have one for genderize.io.
```javascript
    const { genderise } = require('genderGuesser');
    const nameArray = ['Lily'];
    const countryCode = 'GB';
    const apiKey = '1234';
    const genderisedArray = await genderise(nameArray, countryCode, apiKey);
    console.log(genderisedArray); // [{ "name": "Lily", "gender": "female", "probability": 0.99, "count": 553 }]
```

## Guess Title

The `guessTitle` function uses genderise to return a title based on the gender of a given name.  It will return `Ms` if the name is likely to be female, but will default to `Mr` in all other cases.

```javascript
    const { guessTitle } = require('genderGuesser');
    const title = await guessTitle('Lily');
    console.log(title); // Ms
```
