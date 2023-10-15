
const { createServer } = require('http');
const { createRequestHandler } = require("@remix-run/express");
const { installGlobals, broadcastDevReady } = require("@remix-run/node");
const compression = require("compression");
const express = require("express");
const morgan = require("morgan");
const closeWithGrace = require("close-with-grace");
const path = require("path");


installGlobals();

const BUILD_DIR = path.join(process.cwd(), "build");
const build = (require(BUILD_DIR));

let devBuild = build;
let devToolsConfig = null;
// Make sure you guard this with NODE_ENV check
if (process.env.NODE_ENV === 'development') {
  const { withServerDevTools, defineServerConfig } = require("remix-development-tools/server");

  // Allows you to define the configuration for the dev tools
  devToolsConfig = defineServerConfig({
    logs: {
      // allows you to not log cookie logs to the console
      cookies: true,
      // allows you to not log defer logs to the console
      defer: true,
      // allows you to not log action logs to the console
      actions: true,
      // allows you to not log loader logs to the console
      loaders: true,
      // allows you to not log cache logs to the console
      cache: true,
      // allows you to not log when cache is cleared to the console
      siteClear: true,
    },
  });

  // wrap the build with the dev tools
  devBuild = withServerDevTools(build, devToolsConfig);
}

const app = express();

app.use(compression()); // compress static files

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Remix fingerprints its assets so we can cache forever.
app.use('/build', express.static('public/build', { immutable: true, maxAge: '1y' }));

// Aggressively cache fonts for a year
app.use('/fonts', express.static('public/fonts', { immutable: true, maxAge: '1y' }));

app.use(morgan('tiny')); // logging

const httpServer = createServer(app);

app.all(
  '*',
  createRequestHandler({
    build: process.env.NODE_ENV === 'development' ? (devBuild) : build,
    mode: process.env.NODE_ENV,
  }),
);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.info(`Running app in ${process.env.NODE_ENV} mode`);
  console.info(`Express server running at: http://localhost:${PORT}`);
});

// If you want to run the remix dev command with --no-restart, see https://github.com/remix-run/remix/blob/templates_v2_dev/templates/express

closeWithGrace(async () => {
  await new Promise((resolve, reject) => {
    httpServer.close((e) => (e ? reject(e) : resolve('ok')));
  });
});