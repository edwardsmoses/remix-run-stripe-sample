import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import rdtStylesheet from "remix-development-tools/index.css";

export const links: LinksFunction = () => {
  const linksWithoutDev = [
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  ];
  return [
    ...linksWithoutDev,
    ...(process.env.NODE_ENV === "development"
      ? [{ rel: "stylesheet", href: rdtStylesheet }]
      : []),
  ];
};

function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

let AppExport = App;

// This imports the dev tools only if you're in development
if (process.env.NODE_ENV === "development") {
  const { withDevTools } = require("remix-development-tools"); 
  AppExport = withDevTools(AppExport);
}

export default AppExport;
