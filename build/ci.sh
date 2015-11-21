set -e
if [ -z "$CI_PULL_REQUEST" ]
then
  npm run unit
  # start sauce connect
  cd sc-*-linux && ./bin/sc -u $SAUCE_USERNAME -k $SAUCE_ACCESS_KEY -f ~/sc_ready &
  # Wait for tunnel to be ready
  while [ ! -e ~/sc_ready ]; do sleep 1; done
  # serve example app
  npm run serve-example &
  # Run selenium tests
  npm run e2e-sauce
else
  npm test
fi
