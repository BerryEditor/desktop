import {
  app,
  protocol
} from 'electron';
import pathUtil from 'path';
import fs from 'fs';
import {
  promisify
} from 'util';
import {
  brotliDecompress
} from 'zlib';
import {
  staticDir
} from './environment';

const readFile = promisify(fs.readFile);
const decompress = promisify(brotliDecompress);

const mimeTypes = new Map();
mimeTypes.set('wav', 'audio/wav');
mimeTypes.set('svg', 'image/svg+xml');
mimeTypes.set('png', 'image/png');

const decompressAsset = async (md5ext) => {
  const extension = md5ext.split('.')[1];
  if (!mimeTypes.has(extension)) {
    throw new Error('Unknown extension: ' + extension);
  }
  const baseDirectory = pathUtil.join(staticDir, 'library-files/');
  const compressedFile = pathUtil.join(baseDirectory, `${md5ext}.br`);
  if (!compressedFile.startsWith(baseDirectory)) {
    throw new Error('Path traversal');
  }
  const compressedData = await readFile(compressedFile);
  const decompressed = await decompress(compressedData);
  return {
    data: decompressed,
    type: mimeTypes.get(extension)
  };
};

app.whenReady().then(() => {
  protocol.registerBufferProtocol('tp-fetch', (request, callback) => {
    const md5ext = new URL(request.url).pathname;
    if (request.url.includes("titlebar-icons")) {
      if (fs.existsSync(pathUtil.join(staticDir, "icons/", new URL(request.url).pathname))) {
        callback({
          data: fs.readFileSync(pathUtil.join(staticDir, "icons/", new URL(request.url).pathname)),
          mimeType: "image/png"
        });
      } else {
        callback({
          statusCode: 404
        });
      }
      return;
    }
    decompressAsset(md5ext)
      .then((data) => {
        callback({
          data: data.data,
          mimeType: data.type
        });
      })
      .catch(() => {
        callback({
          statusCode: 404
        });
      });
  });
  protocol.registerBufferProtocol('tw-library-files', (request, callback) => {
    const md5ext = new URL(request.url).pathname;
    decompressAsset(md5ext)
      .then((data) => {
        callback({
          data: data.data,
          mimeType: data.type
        });
      })
      .catch(() => {
        callback({
          statusCode: 404
        });
      });
  });
});

