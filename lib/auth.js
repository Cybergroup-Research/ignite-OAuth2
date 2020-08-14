const { BasicAuth, GenerateToken, VerifyToken } = require('../auth/functions');

module.exports = function (RED) {
    function auth(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.on('input', function (msg) {
            if (config.authType === 'NoAuth'){
                msg.payload = {
                    Status: "OK",
                    Code: 200
                }
            }else if (config.authType === 'BasicAuth') {
                BasicAuthInfo = {
                    authHeaders: msg.req.headers.authorization,
                    username: config.username,
                    password: config.password
                }
                BasicAuth(BasicAuthInfo)
                    .then(response => {
                        msg.payload = response
                    });
            }else if (config.authType === 'jwt') {
                this.expiresIn = config.expiresin
                this.tokenSecret = config.tokensecret
                this.algorithm = config.algorithm
                this.decode = config.decodejwt
                if (this.decode === true) {
                    VerifyToken(msg.payload, this.tokenSecret)
                        .then(response => {
                            msg.payload = response
                        });
                }
                else {
                    jwtconfig = msg.jwtconfig ? msg.jwtconfig : {
                        expiresIn: this.expiresIn,
                        algorithm: this.algorithm
                    }
                    GenerateToken(msg.payload, this.tokenSecret, jwtconfig)
                        .then(response => {
                            msg.payload = response
                        });
                }
            }
            node.send(msg)
        });
    }
    RED.nodes.registerType("auth", auth);
};