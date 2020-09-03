module.exports = function (RED) {
    function jwtconfig(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.expiresin = n.expiresin;
        this.algorithm = n.algorithm;
    }
    RED.nodes.registerType("jwt-config", jwtconfig, {
        credentials: {
            tokensecret: { value: "" },
        }
    });
};