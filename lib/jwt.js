const { GenerateToken, VerifyToken } = require('../auth/functions');

module.exports = function(RED) 
{
  function jwt(config) 
  {
    RED.nodes.createNode(this, config);
    const node = this;
    node.jwtconfig = RED.nodes.getNode(config.jwtconfig);
    node.generatejwt = config.generatejwt;
    this.on('input', function (msg) {
        if (node.generatejwt === true || node.generatejwt === 'true') {
            GenerateToken(msg.payload, node.jwtconfig.credentials.tokensecret, parseInt(node.jwtconfig.expiresin),node.jwtconfig.algorithm)
                .then(response => {
                    msg.payload = response
                    node.send(msg, null);
                });
        }
        else {
            VerifyToken(msg.req.headers.authorization, node.jwtconfig.credentials.tokensecret)
                .then(response => {
                    if(response.StatusCode == 200)
                    {
                        msg["tokenvalue"] = response.payload;
                        node.send([msg, null]);
                    }
                    else{
                        node.send([null,msg]);
                    }
                });
        }
    });
  }

  RED.nodes.registerType('jwt', jwt);
};
