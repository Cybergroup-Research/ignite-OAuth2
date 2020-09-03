module.exports = function(RED) 
{
    const jwt = require("jsonwebtoken"); 
    function decode(config) 
    {
        RED.nodes.createNode(this, config);
        const node = this;
        
        this.on('input', function (msg) {
            msg.payload = jwt.decode(msg.payload);
            node.send(msg);
        });
    }

    RED.nodes.registerType('decode', decode);
};
