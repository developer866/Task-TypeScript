const jwt = require("jsonwebtoken");
function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "missing or invalid authentication" });
  }
  try {
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = { id: decode.id, email: decode.email };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Acess token expires" });
    }
    return res.status(401).json({ message: "invalid token" });
  }
}
module.exports = auth;
