const { BasicAuth, GenerateToken, VerifyToken } = require('../auth/functions');

module.exports = function(RED) 
{
  function auth(config) 
  {
    RED.nodes.createNode(this, config);
    const node = this;
    node.authconfig = RED.nodes.getNode(config.authconfig);
    node.generatejwt = config.generatejwt;
    this.on('input', function (msg) {
        if (node.authconfig.authType === 'Basic') {
            var basicAuthInfo = {
                authHeaders: msg.req.headers.authorization,
                username: node.authconfig.username,
                password: node.authconfig.credentials.password
            };
            BasicAuth(basicAuthInfo)
                .then(response => {
                        if(response.StatusCode == 200)
                        {
                            node.send([msg, null]);
                        }
                        else{
                            node.send([null,msg]);
                        }
                });
        }else if (node.authconfig.authType === 'jwt') {
            if (node.generatejwt === true) {
                GenerateToken(msg.payload, node.authconfig.credentials.tokensecret, parseInt(node.authconfig.expiresin),node.authconfig.algorithm)
                    .then(response => {
                        msg.payload = response
                        node.send(msg, null);
                    });
            }
            else {
                VerifyToken(msg.req.headers.authorization, node.authconfig.credentials.tokensecret)
                    .then(response => {
                        if(response.StatusCode == 200)
                        {
                            node.send([msg, null]);
                        }
                        else{
                            node.send([null,msg]);
                        }
                    });
            }
        }
    });
  }

  RED.nodes.registerType('auth', auth);
};
