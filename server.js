'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
var https = require('https');
var fs = require('fs'),
    path = require('path');
restService.use(bodyParser.urlencoded({
    extended: true
}));
restService.use(bodyParser.json());

var Index = require("./index");
var olLogin = require("./ollogin");

var speech = "";
var userid = "";

restService.get('/outcallback', function(request, response) {
    var code = request.query.code;
    console.log("Code : " + code);
    response.sendFile(path.join(__dirname, '/public/success.html'));
});

restService.post('/inputmsg', function(req, res) {

    try {
        https.get("https://vikinews.herokuapp.com");
        https.get("https://vikiviki.herokuapp.com");
        https.get("https://salty-tor-67194.herokuapp.com");
        https.get("https://opty.herokuapp.com");


        console.log("Req  : " + JSON.stringify(req.body));

        if (req.body.originalRequest != null) {

            switch (req.body.originalRequest.source) {
                case "skype":
                    userid = req.body.originalRequest.data.address.user.id;
                    console.log("skype userid : " + userid);
                    break;
                case "twitter":
                    userid = req.body.originalRequest.data.direct_message.sender_id;
                    console.log("Tweet userid : " + userid);
                    break;
                case "slack":
                    userid = req.body.originalRequest.data.event.user;
                    console.log("Slack userid : " + userid);
                    break;
                case "google":
                    userid = req.body.originalRequest.data.user.userId;
                    console.log("Google userid : " + userid);
                    break;
                case "facebook":
                    userid = req.body.originalRequest.data.sender.Id;
                    console.log("Facebook userid : " + userid);
                    break;

                default:
                    console.log("Default");
            }
        }
        res.redirect('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=79965cc7-c7bb-4a73-910b-d286d8bfc983&scope=Calendars.ReadWrite&redirect_uri=https%3A%2F%2Fvikii.herokuapp.com%2Foutcallback%2F&response_type=code/');


//        var options = {
//          "method": "GET",
//          "hostname": "login.microsoftonline.com",
//          "path": "/common/oauth2/v2.0/authorize?client_id=79965cc7-c7bb-4a73-910b-d286d8bfc983&scope=Calendars.ReadWrite&redirect_uri=https%3A%2F%2Fvikii.herokuapp.com%2Foutcallback%2F&response_type=code",
//          "headers": {
//            "content-type": "text/html"
//          }
//        };
//
//        var reqOut = https.request(options, function (resOut) {
//          var chunks = [];
//
//          resOut.on("data", function (chunk) {
//            chunks.push(chunk);
//          });
//
//          resOut.on("end", function () {
//              try{
//                  console.log("Hi");
//                  var body = Buffer.concat(chunks);
//                    resOut.render(body);
////                    speech = "Please login!";
////                    res.json({
////                      speech: speech,
////                      displayText: speech
////                    });
//              }
//              catch(e){
//                  console.log("e :" + e);
//                speech = "Under maintenance! Sorry!";
//                res.json({
//                  speech: speech,
//                  displayText: speech
//                });
//              }
//          });
//        resOut.on("error", function (e) {
//            console.log("E : " + e);
//                speech = "Under maintenance! Sorry!";
//                res.json({
//                  speech: speech,
//                  displayText: speech
//                });
//            
//          });
//        });

        reqOut.end();
        
    } catch (e) {
        console.log("Error : " + e);
    }

});




restService.post('/newuser', function(request, response) {
    console.log('App . POST');
    //console.log('Req : '+ JSON.stringify(request.body)  );

    var varAuth = new Buffer(request.body.username + ':' + request.body.password).toString('base64');
    var vikiAuthBody = {
        "UserId_c": someUserID,
        "OSCAuth_c": varAuth
    };

    console.log('vikiAuthBody : ' + JSON.stringify(vikiAuthBody));

    var newoptions = {
        host: 'acs.crm.ap2.oraclecloud.com',
        port: 443,
        path: '/salesApi/resources/latest/VikiAuth_c/',
        data: vikiAuthBody,
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + varAuth,
            'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
        }
    };
    var respString = "",
        resObj;
    var post_req = https.request(newoptions, function(res) {
        res.on('data', function(chunk) {
            console.log('Response: ' + chunk);
            respString = respString + chunk;
        });
        res.on('end', function() {
            console.log('rES sTATUS: ' + JSON.stringify(res.statusCode));
            if (res.statusCode >= 200 && res.statusCode < 300)
                response.send("Success");
            else
                response.send("Fail");
        })
    }).on('error', function(e) {
        console.log('error: ' + error);
        response.send("Error : " + error);
    });
    post_req.write(JSON.stringify(vikiAuthBody));
    post_req.end();
});

restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});