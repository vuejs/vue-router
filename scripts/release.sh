set -e
echo "Enter release version: "
read VERSION

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."
  npm test

  # commit
  npm version $VERSION --message "chore(release): %s"
  VERSION=$VERSION npm run build
  git add dist
  git commit --amend --no-edit # merge with previous commit

  echo "Please the git history and press enter"
  read OKAY

  # publish
  git push origin refs/tags/v$VERSION
  git push
  npm publish

  # changelog
  npm run changelog
  echo "Please check the changelog and press enter"
  read OKAY
  git add CHANGELOG.md
  git commit -m "chore(changelog): $VERSION"
  git push
fi
