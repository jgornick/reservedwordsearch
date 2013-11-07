/**
 * Utility to parse old platform lists and convert to JSON schemas.
 */

var
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    argv = require('optimist').argv,
    source = argv.s,
    destination = argv.d;

if (!fs.existsSync(source)) {
    console.log('Source does not exist.');
    return process.exit(1);
}

function getPlatformItem(platform, version, wordsList) {
    return {
        platform: platform,
        version: version,
        words: wordsList
    };
}

function getWordsList(words) {
    var
        result = [],
        word,
        tags,
        wordItem;

    for (var i = 0, len = words.length; i < len; i++) {
        tags = words[i].split(',');
        word = String(tags.shift()).replace(/^\s\s*/, '').replace(/\s\s*$/, '').trim();

        if (word == '') {
            continue;
        }

        wordItem = { word: word };
        if (tags.length) {
            wordItem.tags = tags;
        }

        result.push(wordItem);
    }

    return result;
}

var files = fs.readdirSync(source);

for (var i = 0, len = files.length; i < len; i++) {
    var
        fileName = files[i],
        platform,
        version,
        fileNameParts;

    // Skip non-txt files.
    if (path.extname(fileName) != '.txt') {
        continue;
    }

    fileNameParts = path.basename(fileName, path.extname(fileName)).split('-');

    var words = fs.readFileSync(source + '/' + fileName).toString().split('\n');

    if (fileNameParts[0] == 'future') {
        fileNameParts.shift();
        words = words.map(function(word) {
            return word + ',future';
        });
    }

    platform = fileNameParts[0];
    version = fileNameParts[1] || null;

    var platformFileName = fileNameParts.join('-') + '.json';
    var wordsList = getWordsList(words);

    if (fs.existsSync(destination + '/' + platformFileName)) {
        existingPlatformItem = JSON.parse(fs.readFileSync(destination + '/' + platformFileName).toString());
        Array.prototype.push.apply(wordsList, existingPlatformItem.words);
    }

    _.remove(wordsList, function(item) {
        return item.word == '';
    });
    wordsList = _.sortBy(wordsList, 'word');
    wordsList = _.uniq(wordsList, 'word');

    var platformItem = getPlatformItem(platform, version, wordsList);

    fs.writeFileSync(destination + '/' + platformFileName, JSON.stringify(platformItem, null, '    '));
}