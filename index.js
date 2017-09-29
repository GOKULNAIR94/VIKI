module.exports = function( req, res ) {
  
  const express = require('express');
  const bodyParser = require('body-parser');
  const restService = express();
  var http = require('https');
  var fs = require('fs');


  var intentName = req.body.result.metadata.intentName;
  console.log( "intentName : " + intentName );
  try{
    var speech = "";    
    if( intentName == "Default Welcome Intent")
    {
      speech = "Hi! How can i help?";
        return res.json({
          speech: speech,
          displayText: speech
        })
    }
  }
  catch(e)
  {
    console.log( "Error : " + e );
  }
    
    var varHost = '';
    var varPath = '';
    
    console.log( "intentName : " + intentName);
    try
    {
        if( intentName == 'News' || intentName == 'News - link' ){
            varHost = 'vikinews.herokuapp.com';
            varPath = '/inputmsg'; 
        }
    
    if( intentName == 'Budget' || intentName == 'Expense' || intentName.indexOf( "DCP -" ) == 0 || intentName.indexOf( "ADS_" ) == 0 || intentName.indexOf( "Hyperion ADS -" ) == 0 || intentName == 'Hyperion - no - yes' || intentName == 'reporting' ){
            varHost = 'vikiviki.herokuapp.com';
            varPath = '/inputmsg'; 
        }
        
//        if( intentName == 'reporting' ){
//            varHost = 'salty-tor-67194.herokuapp.com';
//            varPath = '/report';
//        }
        
        if( intentName == 'oppty' || intentName=='oppty - next' || intentName=='oppty - custom' || intentName.indexOf( "oppty - News" ) == 0 || intentName.indexOf( "Activities - Sales" ) == 0 ){
            //varHost = 'polar-sea-99105.herokuapp.com';
            varHost = 'opty.herokuapp.com';
            varPath = '/oppty';
        }
        console.log( "varHost : " + varHost );
        console.log( "varPath : " + varPath);

        

        var newoptions = {
          host: varHost,
          path: varPath,
          data: req.body,
          method:'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        };

        var body = "";
        var responseObject;

        var post_req = http.request(newoptions, function(response) {
          response.on('data', function (chunk) {
            body += chunk;
          });

          response.on('end', function() {
              console.log( "Body : " + body );
              try
              {
                  responseObject = JSON.parse(body);
                  res.json(responseObject);
              }
              catch(e){
                speech = "Something went wrong! Please try again later!";
                res.json({
                  speech: speech,
                  displayText: speech
                })
              }
          })
        }).on('error', function(e){
          speech = "Something went wrong! Please try again later!";
            res.json({
              speech: speech,
              displayText: speech
            })
        });
        post_req.write(JSON.stringify(req.body));
        post_req.end();
      
    }
    catch(e)
    {
        console.log("Error : " + e );
    }
}
