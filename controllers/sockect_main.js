var helper = require('./../helpers/helpers');
var db = require('./../helpers/db_helpers');
var fs = require('fs');


module.exports.controller = function(app, io, socket_list) {
    var response = '';

    const msg_success = "successfully"
    const msg_fail = "fail"


    io.on('connection', function(client) {

        client.on('UpdateSocket', function(data, socketId) {
            helper.Dlog('UpdateSocket Data :- ' + data);
            var jsonObj = JSON.parse(data);

            helper.CheckParameterValid_Socket(client, 'UpdateAPPSocket', jsonObj, ['user_id', 'auth_token'], () => {
                
                    socket_list['us_' + jsonObj.user_id] = { 'socket_id': client.id }
                    response = { "success": "true", "status": "1", "message": msg_success }
                    
                    client.emit('UpdateSocket', response)
               
            })
        })
    })

}
