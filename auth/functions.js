const jwt = require("jsonwebtoken");

// Sets in Key value pair
exports.BasicAuth = async (info) => {
  try {
    mySecret = 'Basic ' + Buffer.from(`${info.username}:${info.password}`).toString('base64');
    if (info.authHeaders === mySecret) {
      return result = {
        Status: "OK",
        Code: 200
      }
    } else {
      return result = {
        Status: "Unauthorized",
        Code: 401
      }
    }
  } catch (err) {
    return err;
  }
};

// returns the JWT token
exports.GenerateToken = async (data, tokenSecret, config) => {
  try {
    return await jwt.sign(data, tokenSecret, config)
  }
  catch (err) {
    return err;
  }
};

// verifies token and returns data, error if token is invalid
exports.VerifyToken = async (token, tokenSecret) => {
  try {
    return await jwt.verify(token, tokenSecret)
  } catch (err) {
    return err
  }
};