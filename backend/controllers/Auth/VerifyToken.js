const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, process.env.authTokenKey, function(err, decoded) {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // token has expired
        return res.status(401).send({auth: false, message: 'Authorization has expired.'});
      }
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    // if valid, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;