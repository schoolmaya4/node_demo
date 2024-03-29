var mysql = require('mysql')
var helper = require('./helpers');
var config = require('config');
var dbConfig = config.get('dbConfig');
var db = mysql.createConnection(dbConfig);

if (config.has('optionalFeature.detail')) {
    var detail = config.get('optionalFeature.detail');
    Dlog("config : " + detail);
}

reconnect(db, () => { });

function reconnect(connection, callback) {
    helper.Dlog("\n New connection tentative... (" + helper.server_YYYYMMDD_HHmmss() + ")");

    connection = mysql.createConnection(dbConfig);
    connection.connect((err) => {
        if (err) {
            helper.Dlog(err)
            setTimeout(() => {
                helper.Dlog("--------------- DB ReConnecting Error (" + helper.server_YYYYMMDD_HHmmss() + ").................");
                reconnect(connection, callback);
            }, 5 * 1000);
        } else {
            helper.Dlog("\n\t *** New connection established with the database. ***")
            db = connection;
            return callback();
        }
    });

    connection.on('error', (err) => {
        helper.Dlog("------------------------------ App is connection Crash DB helper (" + helper.server_YYYYMMDD_HHmmss() + ") ------------------------");
        // helper.ThrowHtmlError(err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            helper.Dlog("/!\\ PROTOCOL_CONNECTION_LOST Cannot establish a connection with the database. /!\\ (" + err.code + ")");
            reconnect(db, callback);
        } else if (err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT") {
            helper.Dlog("/!\\ PROTOCOL_ENQUEUE_AFTER_QUIT Cannot establish a connection with the database. /!\\ (" + err.code + ")");
            reconnect(db, callback);
        } else if (err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
            helper.Dlog("/!\\ PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR Cannot establish a connection with the database. /!\\ (" + err.code + ")");
            reconnect(db, callback);
        } else if (err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE") {
            helper.Dlog("/!\\PROTOCOL_ENQUEUE_HANDSHAKE_TWICE  Cannot establish a connection with the database. /!\\ (" + err.code + ")");
            reconnect(db, callback);
        } else if (err.code === "ECONNREFUSED") {
            helper.Dlog("/!\\ECONNREFUSED  Cannot establish a connection with the database. /!\\ (" + err.code + ")");
            reconnect(db, callback);
        } else if (err.code === "PROTOCOL_PACKETS_OUT_OF_ORDER") {
            helper.Dlog("/!\\PROTOCOL_PACKETS_OUT_OF_ORDER  Cannot establish a connection with the database. /!\\ (" + err.code + ")");
            reconnect(db, callback);
        }
        else {
            throw err;
        }
    })
}

module.exports = {
    query: (sql_query, args, callback) => {

        // helper.Dlog('connection.state =-= ' + db.state);
        if (db.state === 'authenticated' || db.state === "connected") {
            db.query(sql_query, args, (error, result) => {
                return callback(error, result)
            })
        } else if (db.state === 'protocol_error') {
            reconnect(db, () => {
                db.query(sql_query, args, (error, result) => {
                    return callback(error, result)
                })
            })
        } else {
            reconnect(db, () => {
                db.query(sql_query, args, (error, result) => {
                    return callback(error, result)
                })
            })
        }
    }
}

process.on('uncaughtException', (err) => {
    // handle the error safely
    helper.Dlog("------------------------------ App is Crash DB helper (" + helper.server_YYYYMMDD_HHmmss() + ") ------------------------");
    helper.Dlog(err.code);
    helper.ThrowHtmlError(err);
});