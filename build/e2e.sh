# use a different port to avoid conflicting with npm run serve
PORT=8082

# serve example
./node_modules/.bin/webpack-dev-server \
  --quiet --hot --history-api-fallback\
  --config example/advanced/webpack.config.js \
  --content-base example/advanced \
  --host 0.0.0.0 \
  --port $PORT &

# run e2e tests, make sure to kill the server no matter pass or fail
PORT=$PORT ./node_modules/.bin/nightwatch \
  -c build/nightwatch.local.json \
  -e chrome,firefox \
  && kill $! || (kill $! && exit 1)
