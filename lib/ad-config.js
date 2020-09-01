module.exports = function (RED) {
    function adconfig(n) 
    {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.accountType = n.accountType;
        this.url = n.url;
        this.tenantId = n.tenantId;
        this.grantType= n.grantType;
        this.scope = n.scope;
        this.clientId = n.clientId;
        this.resource = n.resource;
        this.username = n.username;
    }
    RED.nodes.registerType("ad-config", adconfig, 
    {
        credentials: {
            password: { value: "" },
            clientSecret: { value: "" },
        }
    });
};