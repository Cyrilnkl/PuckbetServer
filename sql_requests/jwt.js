const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.'); // on vérifie s'il y a un token

  try {
    const verified = jwt.verify(token, process.env.SECRET_TOKEN); // on vérifie le token secret
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
}

module.exports = { auth }