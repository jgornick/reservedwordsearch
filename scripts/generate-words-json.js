/**
 * Utility to parse a words directory containing the reserved word platform
 * schemas and build a JSON file for consumption on reservedwordsearch.com.
 */

var
    fs = require('fs'),
    path = require('path'),
    argv = require('optimist').argv,
    _ = require('lodash'),
    wordsPath = argv.w,
    destinationPath = argv.d;

if (!fs.existsSync(wordsPath)) {
    console.log('Words path does not exist.');
    return process.exit(1);
}

var
    words = {},
    files = fs.readdirSync(wordsPath),
    filename,
    platform,
    word;

for (var i = 0, len = files.length; i < len; i++) {
    filename = files[i];

    // Skip non-json files.
    if (path.extname(filename) != '.json') {
        continue;
    }

    platformDocument = JSON.parse(fs.readFileSync(wordsPath + '/' + filename).toString());

    for (var x = 0, len = platformDocument.words.length; x < len; x++) {
        wordItem = platformDocument.words[x];

        if ((word = words[wordItem.word]) == null) {
            word = words[wordItem.word] = {};
        }

        if ((wordPlatform = word[platformDocument.platform]) == null) {
            wordPlatform = word[platformDocument.platform] = {};
        }

        wordPlatform[platformDocument.version] = wordItem.tags || [];
    }
}

sortedWords = {};
wordKeys = Object.keys(words).sort();
for (var i = 0, len = wordKeys.length; i < len; i++) {
    sortedWords[wordKeys[i]] = words[wordKeys[i]];
}

if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath);
}

fs.writeFileSync(destinationPath + '/words.json', JSON.stringify(sortedWords, null, ''));