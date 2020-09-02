module.exports = function (RED) {
    function basicConfig(n) 
    {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.username = n.username;
    }
    RED.nodes.registerType("basic-config", basicConfig, 
    {
        credentials: {
            password: { value: "" },
        }
    });
};