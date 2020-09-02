const { BasicAuth } = require('../auth/functions');

module.exports = function(RED) 
{
  function basic(config) 
  {
    RED.nodes.createNode(this, config);
    const node = this;
    node.basicconfig = RED.nodes.getNode(config.basicconfig);
    
    this.on('input', function (msg) {
        var basicAuthInfo = {
            authHeaders: msg.req.headers.authorization,
            username: node.basicconfig.username,
            password: node.basicconfig.credentials.password
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
    });
  }

  RED.nodes.registerType('basic', basic);
};
