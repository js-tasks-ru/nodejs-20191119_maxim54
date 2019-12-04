/* eslint-disable arrow-parens */
const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const LIMIT = 1e6;

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (req.headers['content-length'] > LIMIT) {
        res.statusCode = 413;
        res.end();
        return;
      }
      if (pathname.indexOf('/') > -1) {
        res.statusCode = 400;
        res.end();
        return;
      }
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
      const limitSizeStream = new LimitSizeStream({limit: LIMIT});
      req.pipe(limitSizeStream).pipe(writeStream);
      limitSizeStream.on('error', err => {
        res.statusCode = 413;
        res.end();
        fs.unlink(filepath, () => {});
        return;
      });
      writeStream.on('error', err => {
        if (err.code === 'EEXIST') {
          res.statusCode = 409;
          res.end();
          return;
        }
        res.statusCode = 500;
        res.end();
        fs.unlink(filepath, () => {});
        return;
      });
      writeStream.on('close', () => {
        res.statusCode = 201;
        res.end();
      });
      res.on('close', () => {
        if (!res.finished) {
          res.statusCode = 500;
          fs.unlink(filepath, () => {});
          res.end();
        }
      })

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
