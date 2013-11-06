#!/usr/bin/env bash

start=$(date +%s)
echo -e "Current repo: $TRAVIS_REPO_SLUG\n"

function error_exit
{
  echo -e "\e[01;31m$1\e[00m" 1>&2
  exit 1
}

if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  git config --global user.email "joe@joegornick.com"
  git config --global user.name "Joe Gornick"

  git clone --depth=1 --branch=master https://$GH_TOKEN@github.com/jgornick/reservedwordsearch /tmp/rws/master
  git clone --depth=1 --branch=site https://$GH_TOKEN@github.com/jgornick/reservedwordsearch /tmp/rws/site
  git clone --depth=1 --branch=gh-pages https://$GH_TOKEN@github.com/jgornick/reservedwordsearch /tmp/rws/gh-pages

  cd /tmp/rws/site

  npm install
  node generate-client-schema.js --source /tmp/rws/master --destination /tmp/rws/site/db/rws.json

  # git remote rename origin readonly
  # git remote add origin https://$GH_TOKEN@github.com/jgornick/reservedwordsearch
  # git fetch origin
  # git checkout site

  # bundle exec jekyll build || error_exit "Error generating site";

  # git checkout gh-pages || error_exit "Error checking out gh-pages branch";
  # git clean -fd
  # cp -Rf _site/* . || error_exit "Error copying _site contents to gh-pages";
  # git add .
  # git add -u
  # git commit -m "Regenerate from jgornick/reservedwordsearch@${TRAVIS_COMMIT}"
  # git push origin gh-pages
fi

end=$(date +%s)
elapsed=$(( $end - $start ))
minutes=$(( $elapsed / 60 ))
seconds=$(( $elapsed % 60 ))
echo "Post-Build process finished in $minutes minute(s) and $seconds seconds"