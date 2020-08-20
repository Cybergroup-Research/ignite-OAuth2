const jwt = require("jsonwebtoken");

// Sets in Key value pair
exports.BasicAuth = async (info) => {
  try {
    var mySecret = `Basic ${Buffer.from(`${info.username}:${info.password}`).toString('base64')}`;
    if (info.authHeaders === mySecret) {
      return result = {
        Status: "OK",
        StatusCode: 200
      }
    } else {
      return result = {
        Status: "Unauthorized",
        StatusCode: 401
      }
    }
  } catch (err) {
    return err;
  }
};

// returns the JWT token
exports.GenerateToken = async (data, tokenSecret, expiresIn, algorithm) => {
  try {
    var result =  await jwt.sign(
      {
        data : data,
        exp: Math.floor(Date.now() / 1000) + expiresIn
      },
      tokenSecret, 
      {
       algorithm: algorithm
    });
    return result;
  }
  catch (err) {
    return err;
  }
};

// verifies token and returns data, error if token is invalid
exports.VerifyToken = async (token, tokenSecret) => {
  try {
    token = token.replace("Bearer ", "");
    await jwt.verify(token, tokenSecret)
    var decoded = await jwt.decode(token);
    return result = {
      Status: "OK",
      StatusCode: 200,
      payload : decoded
    }
  } catch (err) {
      return result = {
        Status: "Unauthorized",
        StatusCode: 401
      }
  }
};