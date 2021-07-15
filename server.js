const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config()
app.use(express.json())

//Headers
app.use(function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});

//get token by username
app.post('/getToken', (req, res) => {
  const acessToken = jwt.sign({ username: req.body.username, iat: Math.floor(Date.now() / 1000) - 30 }, process.env.SECRET_ACCESS_TOKEN);
  res.json({ token: acessToken })
})

//verify token and get username
app.post('/getUser', (req, res) => {
  const auth = req.headers['authorization']
  const token = auth && auth.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, function (err, decoded) {
    if (err) return res.sendStatus(403)
    res.send({ username: decoded.username })
  });
})


app.listen(4000, () => {
  console.log("Server is up on port " + 4000)
});