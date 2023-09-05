import app from './express.js';
import https from 'https';
import fs from 'fs';

//const port = process.env.PORT || 3004;

const https_port = process.env.PORT || 3005;

https.createServer(// Provide the private and public key to the server by reading each
  // file's content with the readFileSync() method.
  {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
  }, app
).listen(https_port, (err) => {
  if (err) console.error(err);
  else console.info(`HTTPS Server started on port ${https_port}.`);
});

/*
app.listen(port, (err) => {
  if (err) console.error(err);
  else console.info(`HTTP Server started on port ${port}.`);
});
*/