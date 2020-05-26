set -e
echo "Enter release version: "
read VERSION

read -p "Releasing v$VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing v$VERSION ..."
  npm test

  # commit
  VERSION=$VERSION npm run build
  git add dist
  git commit -m "build: bundle $VERSION"
  npm version $VERSION --message "chore(release): %s"

  # changelog
  npm run changelog
  echo "Please check the git history and the changelog and press enter"
  read OKAY
  git add CHANGELOG.md
  git commit -m "chore(changelog): $VERSION"

  # publish
  git push origin refs/tags/v$VERSION
  git push
  npm publish
fi
