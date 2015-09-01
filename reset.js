'use strict';

var MongoClient = require('mongodb').MongoClient,
    async = require('async'),
    winston = require('winston');

var databaseName = 'nodebb';
var databaseUsername = 'nodebb';
var databasePassword = 'nodebb';

var databaseUrl = 'mongodb://' + databaseUsername + ':' + databasePassword + '@localhost:27017/' + databaseName;
MongoClient.connect(databaseUrl, function(err, db) {
    if (err) return console.log(err);

    winston.info("connected to database");

    var objects = db.collection('objects');
    async.series([
            zeroReputation.bind(null, objects),
            zeroVotes.bind(null, objects),
            removePostVotes.bind(null, objects),
            removePostVoteDates.bind(null, objects),
            removeTopicVotes.bind(null, objects),
            removeReputationLogs.bind(null, objects)
        ],
        function(err, results) {
            db.close();

            if (err) {
                winston.error('ERROR: reset not finished');
                console.log(err);
                return;
            }
            winston.info('OK: reset completed');
        });
});



//poner a cero la reputacion de los usuarios
//db.getCollection('objects').find({_key:/user:\d+$/})
//set: 'reputation':0
function zeroReputation(objects, callback) {
    winston.info('resetting reputation counters');
    objects.update({_key:/user:\d+$/}, { $set: { reputation:0 } }, {multi:true},
        function(err, result) {
            callback(err);
        });
}

//poner a cero el contador de votos de cada post
//db.getCollection('objects').find({_key:/post:\d+$/})
//set: 'votes':0
function zeroVotes(objects, callback) {
    winston.info('resetting post vote counters');
    objects.update({_key:/post:\d+$/}, { $set: { votes:0 } }, {multi:true},
        function(err, result) {
            callback(err);
        });
}

//borrar votos de los usuarios
//db.getCollection('objects').find({_key:/pid:\d+:upvote/})
//db.getCollection('objects').find({_key:/pid:\d+:downvote/})
function removePostVotes(objects, callback) {
    winston.info('removing post votes');
    objects.remove({_key:/pid:\d+:upvote/ }, function(err, results) {
        if (err) return callback(err);

        objects.remove({_key:/pid:\d+:downvote/ }, function(err, results) {
            callback(err);
        });
    });
}

//borrar fechas de los votos
//db.getCollection('objects').find({_key:/uid:\d+:upvote/})
//db.getCollection('objects').find({_key:/uid:\d+:downvote/})
function removePostVoteDates(objects, callback) {
    winston.info('removing post vote dates');
    objects.remove({_key:/uid:\d+:upvote/ }, function(err, results) {
        if (err) return callback(err);

        objects.remove({_key:/uid:\d+:downvote/ }, function(err, results) {
            callback(err);
        });
    });
}

//borrar contadores de votos por post
//db.getCollection('objects').find({_key:/tid:\d+:posts:votes/})
function removeTopicVotes(objects, callback) {
    winston.info('removing topic votes');
    objects.remove({_key:/tid:\d+:posts:votes/ }, function(err, results) {
        callback(err);
    });
}

//borrar reputationLog
//db.getCollection('objects').find({_key:/reputationLog/})
function removeReputationLogs(objects, callback) {
    winston.info('removing reputation logs (from plugin reputation-rules)');
    objects.remove({_key:/reputationLog/ }, function(err, results) {
        callback(err);
    });
}