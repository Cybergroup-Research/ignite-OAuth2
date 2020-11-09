module.exports = function (RED) {
    function oauth1clientconfig(n) 
    {
        RED.nodes.createNode(this, n);

        this.signaturemethod = n.signaturemethod;
        this.realm = n.realm;
        this.consumerkey = n.consumerkey;
        this.tokenid = n.tokenid;
    }
    RED.nodes.registerType("oauth1-client-config", oauth1clientconfig, 
    {
        credentials: {
            consumersecret: { value: "" },
            tokensecret: { value: "" }
        }
    });
};