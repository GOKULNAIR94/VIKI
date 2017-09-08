'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
var http = require('https');
var fs = require('fs');
restService.use(bodyParser.urlencoded({
    extended: true
}));
restService.use(bodyParser.json());

var Index = require("./index");

restService.get('/login', onRequest);
restService.use(express.static(path.join(__dirname, '/public')));

function onRequest(request, response){
  response.sendFile(path.join(__dirname, '/public/index.html'));
}

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