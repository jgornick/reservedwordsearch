/**
 * Utility to parse a source directory containing the reserved word platform
 * schemas and build a JSON file for consumption on reservedwordsearch.com
 */

var
    fs = require('fs'),
    argv = require('optimist').argv,
    source = argv.s,
    destination = argv.d;

if (!fs.existsSync(source)) {
    console.log('Source does not exist.');
    return process.exit(1);
}

if (!fs.existsSync(destination)) {
    console.log('Destination does not exist.');
    return process.exit(1);
}

