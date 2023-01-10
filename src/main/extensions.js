import {app, protocol} from 'electron';
import pathUtil from 'path';
import fs from 'fs';
import {promisify} from 'util';
import {staticDir} from './environment';

const readFile = promisify(fs.readFile);

const extensionDirectory = pathUtil.join(staticDir, 'extensions.turbowarp.org', '/');

app.on('session-created', (session) => {
  session.webRequest.onBeforeRequest({
    urls: ['https://extensions.turbowarp.org/*','https://extensions.tinypatch.ml/*']
  }, (details, callback) => {
    const path = new URL(details.url).pathname;
    callback({
      redirectURL: `tw-extensions://${path}`
    });
  });
});

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'tw-extensions',
    privileges: {
      supportFetchAPI: true
    }
  }
]);

app.whenReady().then(() => {
  protocol.registerFileProtocol('tw-extensions', (request, callback) => {
    const pathAndQuery = request.url.substring('tw-extensions://'.length);
    const path = pathAndQuery.split('?')[0];
    const staticPath = pathUtil.join(extensionDirectory, path);

    if (!staticPath.startsWith(extensionDirectory)) {
      callback({
        statusCode: 404
      });
      return;
    }

    callback(pathUtil.resolve(staticPath));
  });
});