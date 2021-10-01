const jwt = require('jsonwebtoken');
const config = require('config');

const secret = config.get('jwt_secret_key');


module.exports = async (req, res, next) => { // Authentication happens here
    const token = req.header('x-authenticate-token');
    if (!token) return res.status(401).send(JSON.stringify({errorMessage: "Access denied: no token provided."}));

    try {
        console.log(token);
        const decodedToken = await jwt.verify(token, secret); // Given token gets decoded and verified
        console.log(decodedToken);
        req.account = decodedToken;
        next(); // if everything is alright, grant access
    } catch (error) {
        return res.status(400).send(JSON.stringify({errorMessage: 'invalid token'}));
    }
}