import {app, protocol} from 'electron';
import pathUtil from 'path';
import {staticDir} from './environment';

const extensionDirectory = pathUtil.join(staticDir, 'extensions.turbowarp.org', '/');
console.log("Activated");
app.on('session-created', (session) => {
  console.log("Activated Session");
  session.webRequest.onBeforeRequest({
    urls: ['https://extensions.turbowarp.org/*','https://extensions.tinypatch.ml/*']
  }, (details, callback) => {
    const path = new URL(details.url).pathname;
    console.log("Caught", path);
    callback({
      redirectURL: `tw-extensions://${path}`
    });
  });
});

app.whenReady().then(() => {
  protocol.registerFileProtocol('tw-extensions', (request, callback) => {
    const pathAndQuery = request.url.substring('tw-extensions://'.length);
    const path = pathAndQuery.split('?')[0];
    const staticPath = pathUtil.join(extensionDirectory, path);
    console.log("Got:", path);
    if (!staticPath.startsWith(extensionDirectory)) {
      callback({
        statusCode: 404
      });
      return;
    }

    callback(pathUtil.resolve(staticPath));
  });
});