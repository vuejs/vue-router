echo "Enter release version: "
read VERSION

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Releasing $VERSION ..."
    VERSION=$VERSION npm run build
    git add -A
    git commit -m "[build] $VERSION"
    npm version $VERSION --message "[release] $VERSION"
    git push origin refs/tags/v$VERSION
    git push
    npm publish
fi
