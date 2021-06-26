const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
    windowMs: 1000*60,
    max: 50000,
    message: 'Limite de requete au serveur exceder, retenter plus tard.',
    headers: true,
})