var helper = require('./../helpers/helpers')
var db = require('./../helpers/db_helpers')
var fs = require('fs')
var multiparty = require('multiparty')
var request = require('request')

const image_save_path = "./public/img/"
const msg_fail = "fail"

module.exports.controller = (app, io, socket_list) => {

    //String value
    const msg_success = "successfully"    
    app.post('/api/',(req,res)=>{
        helper.Dlog(req.body);
        var reqObj = req.body;

        helper.CheckParameterValid(res, reqObj, [], () => {
            var auth_token = helper.create_request_token();
            helper.Dlog("auth_token :-----------" + auth_token);
           
        });
    })

   
    

}
