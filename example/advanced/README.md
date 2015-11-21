# Advanced Example

This example uses Webpack to bundle the app, and uses vue-loader to enable single file Vue components. Note this app is also used for end-to-end testing, so some of the fake timeouts are made particularly long to ensure the tests pass consistently.

- `route-config.js` is the main route file. It demonstrates nested routing, redirection and global before hook.
- `components/inbox/index.vue` demonstrates the use of common transition lifecycle hooks.
- `components/inbox/message.vue` demonstrates using the `data` transition hook for loading asynchronous data.

### Running the Example

``` bash
# at repo root
npm install
# serve at localhost:8080
npm run serve-example
```
