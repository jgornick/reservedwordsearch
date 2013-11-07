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

  git clone --depth=1 --branch=site https://$GH_TOKEN@github.com/jgornick/reservedwordsearch /tmp/rws/site

  node ./scripts/generate-words-json.js -w ./words -d /tmp/rws/site/rws/

  cd /tmp/rws/site

  git add .
  git add -u
  git commit -m "Regenerate from jgornick/reservedwordsearch@${TRAVIS_COMMIT}"
  git push origin site
fi

end=$(date +%s)
elapsed=$(( $end - $start ))
minutes=$(( $elapsed / 60 ))
seconds=$(( $elapsed % 60 ))
echo "Post-Build process finished in $minutes minute(s) and $seconds seconds"