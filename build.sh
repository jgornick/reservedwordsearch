#!/usr/bin/env bash

start=$(date +%s)
echo -e "Current repo: $TRAVIS_REPO_SLUG\n"

function error_exit
{
  echo -e "\e[01;31m$1\e[00m" 1>&2
  exit 1
}

if [ "$TRAVIS_PULL_REQUEST" == "false" ] && [ "$TRAVIS_REPO_SLUG" == "jgornick/reservedwordsearch" ] && [ "$TRAVIS_BRANCH" == "site" ]; then
  # Set git user
  git config --global user.email "joe@joegornick.com"
  git config --global user.name "Joe Gornick"

  bundle jekyll build 2> /dev/null || error_exit "Error generating site";

  # Fetch all other branches
  git fetch origin 'refs/heads/*:refs/remotes/origin/*' 2> /dev/null || error_exit "Error fetching remote branches";
  git checkout -b gh-pages origin/gh-pages 2> /dev/null || error_exit "Error checking out gh-pages branch";
  cp -Rf _site/* . 2> /dev/null || error_exit "Error copying _site contents to gh-pages";
  git add .
  git add -u
  git commit -m "Regenerate"
fi

end=$(date +%s)
elapsed=$(( $end - $start ))
minutes=$(( $elapsed / 60 ))
seconds=$(( $elapsed % 60 ))
echo "Post-Build process finished in $minutes minute(s) and $seconds seconds"