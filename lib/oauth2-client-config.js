module.exports = function (RED) {
    function oauth2clientconfig(n) 
    {
        RED.nodes.createNode(this, n);
        this.name = n.name;

        this.clientId = n.clientId;
        this.redirectUrl = n.redirectUrl;

        this.authUrl = n.authUrl;
        this.accessTokenUrl = n.accessTokenUrl;
        
        this.scope = n.scope;
        this.state = n.state;
        
        this.username = n.username;
    }
    RED.nodes.registerType("oauth2-client-config", oauth2clientconfig, 
    {
        credentials: {
            password: { value: "" },
            clientSecret: { value: "" },
        }
    });
};