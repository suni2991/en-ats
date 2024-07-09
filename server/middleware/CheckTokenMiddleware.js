const CheckTokenMiddleware = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");

    // Get token from array
    const bearerToken = bearer[1];
    console.log(bearerToken);
    // Set the token
    if (bearerToken != process.env.JWT_TOKEN) {
      res.status(401).json({
        message: "Invalid token",
      });
    } else {
      next();
    }
  } else {
    res.status(401).json({
      message: "Token is required",
    });
  }
};

module.exports = CheckTokenMiddleware;
