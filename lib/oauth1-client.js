module.exports = function(RED) 
{
  function oauth1Client(config) 
  {
    RED.nodes.createNode(this, config);
    const node = this;
    node.oauth1config = RED.nodes.getNode(config.oauth1config);
    node.appendto = config.appendto;
    
    this.on('input', function (msg) {
        var oauth1info = {
            realm: node.oauth1config.realm,
            signaturemethod: node.oauth1config.signaturemethod,
            consumerkey: node.oauth1config.consumerkey,
            tokenid: node.oauth1config.tokenid,
            consumersecret: node.oauth1config.credentials.consumersecret,
            tokensecret: node.oauth1config.credentials.tokensecret,
            appendto : node.appendto
        };
        console.log(oauth1info)
//oauth1 specific code changes
        node.send("testing")
    });
  }

  RED.nodes.registerType('oauth1', oauth1Client);
};
