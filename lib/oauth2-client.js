module.exports = function(RED) 
{
  const request = require('request');
  const ClientOAuth2 = require('client-oauth2')

  function oauth2Client(config) 
  {
    RED.nodes.createNode(this, config);
    const node = this;
    node.outputlocation = config.outputlocation;
    node.auth2Config = RED.nodes.getNode(config.auth2Config);
    node.flow = config.flow;

    this.on('input', function (msg) {
        var authClient= new ClientOAuth2({
          clientId: node.auth2Config.clientId,
          clientSecret: node.auth2Config.credentials.clientSecret,
          accessTokenUri: node.auth2Config.accessTokenUrl,
          authorizationUri: node.auth2Config.authUrl,
          redirectUri: node.auth2Config.redirectUrl,
          scopes: node.auth2Config.scope.split(',')
        });
        
        var payloadAttribute = "payload";
        if(node.outputlocation && node.outputlocation.length > 0)
        { 
          payloadAttribute = node.outputlocation;
        }
        switch(node.flow)
        {
            case "loginurl":
              msg[payloadAttribute] = authClient.code.getUri();
              node.send(msg);
              break;
            case "gettoken":
                authClient.code.getToken(msg.req.originalUrl).then(
                  function(r){
                    msg[payloadAttribute] = r.data;
                    node.send(msg);
                  }
                ).catch(
                  function(e){
                    msg[payloadAttribute] = e.body;
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
              authClient.owner.getToken(username, password).then(function(r)
              {
                msg[payloadAttribute] = r.data;
                node.send(msg);
              }).catch(function(e){
                msg[payloadAttribute] = e.body;
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
  RED.nodes.registerType('oauth2 client', oauth2Client);
};
