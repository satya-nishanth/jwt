//jshint esversion:8
require('dotenv').config();

const express = require('express');
const download = require('image-downloader');
const app = express();
const jwt = require('jsonwebtoken');
const jsonpatch = require('jsonpatch');
const imageThumbnail = require('image-thumbnail');
app.use(express.json());

// const mydoc = {
//   "baz": "qux",
//   "foo": "bar"
// 
const thepatch = [
  { "op": "replace", "path": "/baz", "value": "boo" }
];

app.post('/patch', authenticateToken, (req, res) => {
  patcheddoc = jsonpatch.apply_patch(req.body.mydoc, thepatch);
  res.json({
      status: "success",
    mydoc: patcheddoc

  });
});

app.post('/thumbnail', authenticateToken, (req, res) => {
  const options = {
  url: req.body.url,
  dest: __dirname             // Save to /path/to/dest/image.jpg
};
downloadIMG(options,res);

});

app.post('/login', (req, res) => {
  // Authenticate User To Do

  //Create Jwt if login is success
  const user = {
    name: req.body.username
  };
  const token = jwt.sign(
    user,
    process.env.TOKEN_SECRET
  );
  res.json({
    status: "success",
    token: token

  });
});

function authenticateToken(req, res, next) {
  //middleware verify the jwt
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

async function downloadIMG(options,res) {
  try {
    //download image
    const { filename, image } = await download.image(options);
    console.log(filename);
    // convert to 50x50 thumbnail
    let option = { width: 50, height: 50, responseType: 'buffer', jpegOptions: { force:true, quality:90 } };
    const thumbnail = await imageThumbnail(filename, option);
    console.log(thumbnail);
    res.writeHead(200, {
       'Content-Type': 'image/png',
       'Content-Length': thumbnail.length
     });
     res.end(thumbnail);
  } catch (e) {
    console.error(e);
  }
}

app.listen(process.env.PORT || 3000);

module.exports = app;
