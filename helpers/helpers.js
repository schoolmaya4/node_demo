var fs = require('fs');
var moment = require('moment-timezone');
var nodemailer = require('nodemailer');
var request = require('request');
const app_debug_mode = true;
const timezone_name = "Asia/Kolkata";
const msg_server_internal_error = "Server Internal Error"

const transport = nodemailer.createTransport({
    service: 'Godaddy',
    auth: {
        user: '',
        pass: '',
    }
});


module.exports = {

    ImagePath: () => {
        return "http://localhost:3000/img/";
    },

    ThrowHtmlError: (err, res) => {

        Dlog("------------------------------ App is Helpers Throw Crash Mayur(" + server_YYYYMMDD_HHmmss() + ") ------------------------");
        Dlog(err.stack);
        fs.appendFile('./crash_log/Crash' + server_datetime('YYYY-MM-DD HH mm ss ms') + '.txt', err.stack, (err) => {
            if (err) {
                Dlog(err);
            }
        })

        if (res) {
            //throw err;
            res.json({ "success": "false", "status": 0, "message": msg_server_internal_error });
            return
        } 
    },

    ThrowSocketError: (err, client, name) => {

        Dlog("------------------------------ App is Helpers Throw Crash Mayur(" + server_YYYYMMDD_HHmmss() + ") ------------------------");
        Dlog(err.stack); 
        fs.appendFile('./crash_log/Crash' + server_datetime('YYYY-MM-DD HH mm ss ms') + '.txt', err.stack, (err) => {
            if (err) {
                Dlog(err);
            }
        })
        if (client) {
            client.emit(name, { "success": "false", "status": 0, "message": msg_server_internal_error })
            return
        } 
    },

    CheckParameterValid: (res, jsonObj, check_keys, callback) => {
        var is_valid = true;
        var missing_parameter = "";
        check_keys.forEach((key, indexOf) => {
            if (!Object.prototype.hasOwnProperty.call(jsonObj, key)) {
                is_valid = false;
                missing_parameter += key + " ";
            }
        });
        if (!is_valid) {

            if (!app_debug_mode){
                missing_parameter = "";
            }
            res.json({ "success": "false", "status": 0, "message": "Missing parameter (" + missing_parameter + ")" })
        } else {
            return callback();
        }
    },

    CheckParameterValid_Socket: (client, name, jsonObj, check_keys, callback) => {
        var is_valid = true;
        var missing_parameter = "";
        check_keys.forEach((key, indexOf) => {
            if (!Object.prototype.hasOwnProperty.call(jsonObj, key)) {
                is_valid = false;
                missing_parameter += key + " ";
            }
        });
        if (!is_valid) {

            if (!app_debug_mode) {
                missing_parameter = "";
            }
            
            client.emit(name, { "success": "false", "status": 0, "message": "Missing parameter (" + missing_parameter + ")" })
        } else {
            return callback();
        }
    },

    remove_key_from_array: (arr, remove_key) => {
        for (var i = remove_key.length - 1; i >= 0; i--) {
            delete arr[remove_key[i]];
        }
    },

    server_datetime: (format) => {
        return server_datetime(format);
    },

    server_datetime_now_add: (add_minutes, format) => {
        var jun = moment(new Date()).add(add_minutes, 's');
        jun.tz(timezone_name).format();
        //Dlog("server_datetime :-" +jun.format(format));
        return jun.format(format);
    },

    time_duration: (date1, date2, callback) => {
        Dlog(" date : - " + date1 + "\t\t date" + date2);
        var now = moment(date1); // date 1
        var end = moment(date2); // date 2
        var duration = moment.duration(now.diff(end));
        var total_minutes = duration.asMinutes();
        var duration_string = moment.utc(duration.asMilliseconds()).format("mm:ss");
        if (total_minutes > 60) {
            duration_string = moment.utc(duration.asMilliseconds()).format("HH:mm:ss");
        }
        //Dlog(" duration : - " + total_minutes + "\t\t\tduration_string" +duration_string);
        return callback(total_minutes, duration_string);
    },

    now_time_to_pickup_diff: (date) => {
        Dlog(" date : - " + date);
        var now = moment(date); // date 1
        var end = moment(new Date()); // date Now Date
        var duration = moment.duration(now.diff(end));
        var total_minutes = duration.asMinutes();
        return total_minutes;
    },

    isDateExpiry: (date) => {
        var now = moment(date); // date 1
        var end = moment(new Date()); // date Now Date
        var duration = moment.duration(now.diff(end));
        var total_minutes = duration.asMinutes();
        return total_minutes;
    },

    server_datetime_add_minutes: (date, format, add_minutes) => {
        var jun = moment(new Date(date)).add(add_minutes, 'm');
        jun.tz(timezone_name).format();
        //Dlog("server_datetime_add_minutes :- " + jun.format(format));
        return jun.format(format);
    },

    mysql_datetime_add_minutes: (date, add_minutes) => {

        if (date == ""){
            return date;
        }
        var jun = moment(new Date(date)).add(add_minutes, 'm');
        jun.tz(timezone_name).format();
        //Dlog("server_datetime_add_minutes :- " + jun.format(format));
        return jun.toDate();
    },


    server_mysql_date: (date) => {
        var jun = moment(date);
        jun.tz(timezone_name).format();
        //Dlog(jun.format("server_Mysql :- "+'YYYY-MM-DD HH:mm:ss'));
        return jun.format('YYYY-MM-DD HH:mm:ss');
    },

    server_mysql_date_only: (date) => {
        var jun = moment(date);
        jun.tz(timezone_name).format();
        //Dlog(jun.format("server_Mysql :- "+'YYYY-MM-DD HH:mm:ss'));
        return jun.format('YYYY-MM-DD');
    },

    server_YYYYMMDD_HHmmss: () => {
        return server_YYYYMMDD_HHmmss();
    },

    date_one_format_other: (date, format, new_format) => {
        return moment(date, format).format(new_format);
        //yyyy-MM-ddTHH:mm:ss.SSSZ
    },

    date_mysql_format: (date, format = 'YYYY-MM-DD HH:mm:ss') => {
        Dlog(moment.tz(date, format, timezone_name).toISOString());
        return moment.tz(date, format, timezone_name).toISOString();
    },

    create_request_token: () => {
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = 20; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        result = result + server_datetime('YYYYMMDDHHmmssms');
        //Dlog ("Token :- "+ result );
        return result;
    },

    image_name_genrate: () => {
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = 10; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return server_datetime('YYYYMMDDHHmmssms') + result + '.jpg';
    },

    file_name_generate: (extions) => {
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = 10; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return server_datetime('YYYYMMDDHHmmssms') + result + '.' + extions;
    },

    file_name_generate_with_extions: () => {
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = 10; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return server_datetime('YYYYMMDDHHmmssms') + result + '.';
    },

    Dlog: (log) => {
        return Dlog(log);
    },

    FindNearByLocation: (lat, long, radius_km, callback) => {
        var latitude = parseFloat(lat);
        var longitude = parseFloat(long);
        var distance_find = parseFloat(radius_km); // value is km convent 1 miles = 1.60934 km
        //Dlog("latitude : " + latitude+ "longitude : "+longitude +"distance_find : " +distance_find);
        var radius = 6371;
        var maxlat = latitude + ((distance_find / radius) * 180 / Math.PI);
        var minlat = latitude - ((distance_find / radius) * 180 / Math.PI);
        var maxlng = longitude + ((distance_find / radius / Math.cos(latitude * Math.PI / 180)) * 180 / Math.PI);
        var minlng = longitude - ((distance_find / radius / Math.cos(latitude * Math.PI / 180)) * 180 / Math.PI);
        Dlog("minlat : " + minlat + "minmaxlatlat : " + maxlat + "minlng : " + minlng + "maxlng : " + maxlng);
        return callback(minlat, maxlat, minlng, maxlng);
    },

    distance: (lat1, lon1, lat2, lon2) => {
        return distance(lat1, lon1, lat2, lon2);
    },

    sendMail: (to_mail,subject,html_text) => {
        
        var mailOptions = {
            from: 'support@ohicabs.com',
            to: to_mail,
            subject: subject,
            html: html_text,
        };
        
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                Dlog(error);
            }
            Dlog('Message sent: ${info.response}');
        });
    },
    
    sendMailFile: (to_mail,subject,html_text,filename,file_path) => {
        
        var mailOptions = {
            'from': 'support@ohicabs.com<support@ohicabs.com>',
            'to': to_mail,
            'subject': subject,
            'html': html_text,
            'attachments': [
                {
                    'filename': filename,
                    'content': fs.createReadStream(file_path)
                }
            ]
        };
        
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                Dlog(error);
            }
            Dlog('Message sent: ${info.response}');
        });
    },


};

function server_datetime(format) {
    var jun = moment(new Date());
    jun.tz(timezone_name).format();
    //Dlog("server_datetime :-" +jun.format(format));
    return jun.format(format)
}

function Dlog(log) {
    // if (app_debug_mode) {
        console.log(log)
    //}
}

function server_YYYYMMDD_HHmmss() {
    //YYYY-MM-DD HH:mm:ss
    var jun = moment(new Date());
    jun.tz(timezone_name).format();
    //Dlog(jun.format("server_YYYYMMDD_HHmmss :- "+'YYYY-MM-DD HH:mm:ss'));
    return jun.format('YYYY-MM-DD HH:mm:ss');
}

function distance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * parseFloat(lat1) / 180;
    var radlat2 = Math.PI * parseFloat(lat2) / 180;
    var theta = parseFloat(lon1) - parseFloat(lon2);
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;
    //Dlog(dist);
    if (isNaN(dist)) {
        //Dlog("Nan :- "+lat1+","+lon1+","+lat2+","+lon2+",");
        dist = 0;
    }
    //Dlog("dist :-"+dist);
    return dist;
}



process.on('uncaughtException', (err) => {
    
})