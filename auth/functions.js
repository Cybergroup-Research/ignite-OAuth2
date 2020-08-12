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