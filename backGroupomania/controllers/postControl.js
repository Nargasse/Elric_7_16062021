const { request, response } = require('express');
const mysql = require('mysql');

const sqlDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'OCR_P7',
});

exports.getPostList = (request, response, next) => { //TODO : Tester qu'on a uniquement un nombre pour éviter les injections
    sqlDB.query('SELECT id, nom, UserID, date, titre, texte, position FROM post WHERE position = ?', [request.params.position], function (err, result, fields) {
        if (err) return response.status(500).json(err);
        return response.status(200).json(result);
    });
}

exports.getOnePost = (request, response) => {
    sqlDB.query('SELECT id, nom, UserID, date, titre, texte, position FROM post WHERE ID = ?', [request.params.postId], function (err, result) {
        if (err) return response.status(500).json(err);
        return response.status(200).json(result);
    })
}

exports.saveNewPost = (request, response, next) => {

    let newPost = new Object();
    newPost.nom = request.body.nom;
    newPost.date = request.body.date;
    newPost.titre = request.body.titre ? request.body.titre : '';
    newPost.texte = request.body.texte;
    newPost.position = request.body.position;
    newPost.userID = request.body.userID;

    //On pourra ajouter des tests préalable à l'insertion pour chacun de ces paramètres, afin de limiter les risques d'insertions.
    sqlDB.query('INSERT INTO post SET ?', newPost, function (err, result) {
        if (err) return response.status(500).json(err);
        return response.status(201).json(result.insertID);
    });
}

exports.deletePost = (request, response) => {
    sqlDB.query('DELETE FROM post WHERE ID = ?', [request.params.postId], function (err, result) {
        if (err) return response.status(500).json(err);
        return response.status(201).json({msg: 'suppresion done'});
    })
}

exports.editPost = (request, response) => {
    sqlDB.query('UPDATE post SET texte = ? WHERE ID = ?', [request.body.texte, request.params.postId], function (err) {
        if (err) return response.status(500).json(err);
        return response.status(201).json({msg: 'update done'});
    })
}