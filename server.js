'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
var http = require('https');
var fs = require('fs'),
    path = require('path');
restService.use(bodyParser.urlencoded({
    extended: true
}));
restService.use(bodyParser.json());

var Index = require("./index");

restService.get('/login/', onRequest);
restService.use(express.static(path.join(__dirname, '/public')));

var someUserID = "";

function onRequest(request, response){
    someUserID = request.params.id;
    console.log(' Awe: someUserID : ' + someUserID);
  response.sendFile(path.join(__dirname, '/public/index.html'));
}

restService.post('/newuser',function(request,response){
console.log('App . POST');
console.log('Req : '+ JSON.stringify(request.body)  );

    var varAuth = new Buffer( request.body.username + ':' + request.body.password).toString('base64');
    var vikiAuthBody = {
        "UserId_c" : someUserID,
        "OSCAuth_c": varAuth
    };
    
  var newoptions = {
        host: 'acs.crm.ap2.oraclecloud.com',
        port: 443,
        path: '/salesApi/resources/latest/VikiAuthv1_c/',
        data: vikiAuthBody,
        method:'POST',
        headers: {
        'Authorization': 'Basic ' + varAuth,
        'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
      }
  };
  var post_req = https.request(newoptions, function(res) {
      res.on('data', function (chunk) {
          //console.log('Response: ' + chunk);
      });
        res.on('end', function() {
        debugger;
        response.send({statusCode : 200});
      })
    }).on('error', function(e){
    console.error(e);
  });
    post_req.write(JSON.stringify( vikiAuthBody ));
    post_req.end();
});

restService.post('/inputmsg', function(req, res) {
    
    try{
        console.log("Req  : " + JSON.stringify(req.headers));
//        var Id = req.body.Id;
//        console.log( "Id : " + Id );
        if( req.body.originalRequest != null ){
			var userid = req.body.originalRequest.data.user;
			console.log( "userid : " + userid );
		}
//        
//        var accessToken = req.body.originalRequest.data.user.access_token;
//        console.log( "accessToken : " + accessToken );
//        var stringyJSON = JSON.stringify(req.body);
//        console.log( "stringJSON : " + stringyJSON );
        

        
        http.get("https://vikinews.herokuapp.com");
        http.get("https://vikiviki.herokuapp.com");
        http.get("https://salty-tor-67194.herokuapp.com");
        http.get("https://opty.herokuapp.com");

        Index( req, res, function( result ) {
            console.log("Index Called");
        });
    }
    catch(e)
    {
        console.log( "Error : " + e );
    }

});


restService.listen((process.env.PORT || 9000), function() {
  console.log("Server up and listening");
});