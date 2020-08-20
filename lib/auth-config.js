module.exports = function (RED) {
    function authconfig(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.authType = n.authType;
        this.username = n.username;
        this.expiresin = n.expiresin;
        this.algorithm = n.algorithm;
    }
    RED.nodes.registerType("auth-config", authconfig, {
        credentials: {
            password: { value: "" },
            tokensecret: { value: "" },
        }
    });
};