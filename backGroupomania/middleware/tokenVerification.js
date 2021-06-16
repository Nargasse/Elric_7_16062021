const webToken = require('jsonwebtoken');

module.exports = (request, response, next) => {
    try {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = webToken.verify(token, 'LA_SPECTRE_DES_SECONDES_BERCE_MON_HUMEUR_COMPLICE');
        const userID = decodedToken.userID;
        if (request.body.userID && request.body.userID !== userID) {
            throw new Error();
        } else {
            next();
        }
    } catch (error) {
        response.status(401).json({ error });
    }
}