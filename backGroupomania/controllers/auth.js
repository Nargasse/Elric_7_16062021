const bcrypt = require('bcrypt');
const webToken = require('jsonwebtoken');

const { request, response } = require('express');
const mysql = require('mysql');
var cookie = require('cookie');

const sqlDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'OCR_P7',
});

exports.createUser = (request, response, next) => {

    sqlDB.query('SELECT nom, mail FROM utilisateurs WHERE mail = ? OR nom = ?', [request.body.mail, request.body.nom], function (err, result) {
        if (err) {
            console.log(err);
            return response.status(500).json ({ msg: 'Erreur de communication serveur' });
        } else if (typeof result[0] !== 'undefined') {
            if (result[0].mail == request.body.mail) return response.status(403).json({ msg: 'Cette adresse mail est déjà utilisé', doublon: 'mail'}); 
            return response.status(403).json({ msg: 'Ce nom est déjà utilisé.', doublon: 'nom' }); 
        } else {
            bcrypt.hash(request.body.password, 10)
            .then(hash => {
            sqlDB.query('INSERT INTO utilisateurs (nom, mail, password) VALUES (?, ?, ?)', [request.body.nom, request.body.mail, hash] , function (err) {
                if (err) return response.status(500).json ({ err });
                return response.status(201).json({ message: 'utilisateur enregistré' });
                })
    })
    .catch(err => response.status(500).json({ err }));
        }
    })

    
}

exports.validateUser = (request, response, next) => {
        sqlDB.query('SELECT ID, nom, password FROM utilisateurs WHERE mail = ?', [request.body.mail], function (err, result) {
        if (err) return response.status(500).json({ msg: 'Erreur de communication avec la BDD' });
        if (typeof result[0] === 'undefined') return response.status(401).json({err});
            bcrypt.compare(request.body.password, result[0].password)
            .then (isSamePassword => {
                if (isSamePassword) {
                    return response.status(200).json({
                        userID: result[0].ID,
                        nom: result[0].nom,
                        token: webToken.sign(
                            { userID: result[0].ID },
                            'LA_SPECTRE_DES_SECONDES_BERCE_MON_HUMEUR_COMPLICE',
                            { expiresIn: '24h'}
                        )
                    })
                } else {
                    return response.status(401).json({ err });
                }
            })
    })
}

exports.suppressUser = (request, response) => {
    sqlDB.query('DELETE FROM utilisateurs WHERE ID = ?', [request.params.userID], function(err) {
        if (err) { 
            console.log(err);
            return response.status(500).json({ msg: 'Erreur de communication avec la BDD'});        
        };
        sqlDB.query('UPDATE post SET nom = ? WHERE userID = ?', ['anonymous', request.params.userID], function (err) {
            if (err) { 
                console.log(err);
                return response.status(500).json({ msg: 'Erreur de communication avec la BDD'});        
            };
            return response.status(205).json({msg: 'Compte supprimmé' });
        })
    })
}