const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticator(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({
      message: "Token is missing, please login",
      status: 2,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      return res.status(401).send({
        message: "Token is not Valied please login",
        status: 2,
      });
    }
    if (decode) {
      res.user = decode.userId;
      next();
    } else {
      res.status(401).send({
        message: "Token is not Valied please login",
        status: 2,
      });
    }
  });
}

module.exports = authenticator;
