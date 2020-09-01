module.exports = function(RED) 
{
  const request = require('request');

  function activeDirectory(config) 
  {
    RED.nodes.createNode(this, config);
    const node = this;
    node.outputlocation = config.outputlocation;
    node.adConfig = RED.nodes.getNode(config.adConfig);
    this.on('input', function (msg) {
      var username = node.adConfig.username;
      var password = node.adConfig.credentials.password;
      if(msg.ad && msg.ad.username)
      {
        username = msg.ad.username;
        password = msg.ad.password;
      }
        request.post(node.adConfig.url + node.adConfig.tenantId +  '/oauth2/token?api-version=1.0', {
            form: {
              'grant_type':  node.adConfig.grantType,
              'scope':  node.adConfig.scope,
              'client_id':  node.adConfig.clientId,
              'resource':  node.adConfig.resource,
              'username':  username,
              'password':  password,
              'client_secret':  node.adConfig.credentials.clientSecret
            }
          },function(e,r,b){
            var status = false;
            var response = "";
            if(e || r.statusCode != 200)
            {
              status = false;
              response = e || b; 
            }
            else
            {
              status = true;
              response = JSON.parse(b);
            }
            var payloadAttribute = "payload";
            if(node.outputlocation && node.outputlocation.length > 0)
            { 
              payloadAttribute = node.outputlocation;
            }
            msg[payloadAttribute] = {
              'status' : status,
              'auth' : response
            };
            node.send(msg);
          });
        
    });
  }

  RED.nodes.registerType('active directory', activeDirectory);
};
