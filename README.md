# Reserved Word Search

Reserved Word Search aggregates [reserved words](https://en.wikipedia.org/wiki/Reserved_word) from many different platforms into a simple search interface.

## Overview

This project consist of 3 parts:

* The platform word documents (master branch)
* The Jekyll site generator (site branch)
* The static site content (gh-pages branch)

Each branch is automatically built using [Travis-CI](https://travis-ci.org/jgornick/reservedwordsearch). When a commit is made to the `master` branch, the build script generates a minified version of all platform words and commits to the `site` branch in folder `rws/words.json`. Then, when a commit is made to the `site` branch, it generates the site content and commits to the `gh-pages` branch.

## Contributing Guidelines

## Contributing Workflow

## License

[MIT](./LICENSE).
