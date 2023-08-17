const errorHandler = require("./errorHandler");
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    console.log(token);
    req.token = token;
    next();
  } else {
    res.json(
      errorHandler("Token is not valid", false, "not a valid token", 404)
    );
  }
}

module.exports = verifyToken;
