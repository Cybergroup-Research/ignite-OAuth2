module.exports = function(RED) 
{
  const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');

  function oauth2Client(config) 
  {
    RED.nodes.createNode(this, config);
    const node = this;
    node.outputlocation = config.outputlocation;
    node.auth2Config = RED.nodes.getNode(config.auth2Config);
    node.flow = config.flow;

    this.on('input', function (msg) {
      var authConfig = {
        client: {
          id: node.auth2Config.clientId,
          secret: node.auth2Config.credentials.clientSecret
        },
        auth: {
          //tokenHost: node.auth2Config.accessTokenUrl,
          tokenPath : ' ',
          //authorizeHost : node.auth2Config.authUrl,
          authorizePath: ' '
        }
      };
        var payloadAttribute = "payload";
        if(node.outputlocation && node.outputlocation.length > 0)
        { 
          payloadAttribute = node.outputlocation;
        }
        var output;
        switch(node.flow)
        {
            case "loginurl":
              authConfig.auth.authorizeHost = node.auth2Config.authUrl;
              authConfig.auth.tokenHost = node.auth2Config.accessTokenUrl;
              var client = new AuthorizationCode(authConfig);
              var authorizationUri = client.authorizeURL({
                  redirect_uri: node.auth2Config.redirectUrl,
                  scope: node.auth2Config.scope,
                  state: ''
                });
                msg.statusCode = 303;
                msg.headers = {
                  Location: authorizationUri
                };
                node.send(msg);
              break;
            case "gettoken":
              authConfig.auth.authorizeHost = node.auth2Config.authUrl;
              authConfig.auth.tokenHost = node.auth2Config.accessTokenUrl;
              var client = new AuthorizationCode(authConfig);
              var tokenParams = {
                code: msg.req.query.code,
                redirect_uri: node.auth2Config.redirectUrl,
                scope: node.auth2Config.scope,
              };
              client.getToken(tokenParams).then(function(r)
              {
                  output = r;
              }).catch(function(e){
                  output = e.data.payload;
              }).finally(function(){
                  msg[payloadAttribute] = output;
                  node.send(msg);
              });
             break;
            case "usercredential":
              var username = node.auth2Config.username;
              if(msg.override && msg.override.username)
              {
                  username = msg.override.username;
              }
              var password = node.auth2Config.credentials.password;
              if(msg.override && msg.override.password)
              {
                password = msg.override.password;
              }
              authConfig.auth.tokenHost = node.auth2Config.accessTokenUrl;
              var client = new ResourceOwnerPassword(authConfig);
              var tokenParams = {
                username: username,
                password: password,
                scope: node.auth2Config.scope,
              };
              client.getToken(tokenParams).then(function(r)
              {
                  output = r;
              }).catch(function(e){
                  output = e.data.payload;
              }).finally(function(){
                  msg[payloadAttribute] = output;
                  node.send(msg);
              });
            break;
            default:
              msg[payloadAttribute] = {
                "error": "Invalid Adapter",
                "error_description:":node.flow + " flow is not defined"
              };
              node.send(msg);
        }
    });
  }
  RED.nodes.registerType('oauth2', oauth2Client);
};
