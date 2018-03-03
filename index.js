module.exports = function( req, res ) {
  
  const express = require('express');
  const bodyParser = require('body-parser');
  const restService = express();
  var http = require('https');
  var fs = require('fs');
    var date = require('date-and-time');
    var QueryDB = require("./queryDB");


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
    }else{
        if( intentName == "Activities")
        {
            var time = date.format(new Date(), 'hh:mm A');
            var date = date.format(new Date(), 'ddd MMM DD YYYY');
            speech = "Its " + time + " " + date + ".\nWhat activitites would you like to see. HR or Sales?";
         return res.json({
              speech: speech,
              displayText: speech
            });

        }else{
            if( intentName == "Activities - HR"){
                var leaveCount = 0, tmCount = 0;
                var qString = "SELECT Name, COUNT(ID) AS lcount FROM LeavesTable WHERE ApprovalStatus='Pending' GROUP BY Name";
                QueryDB( qString, req, res, function(leresult) {
                    if( leresult.rowsAffected != 0){
                        leaveCount = leresult.rowsAffected.lcount;
                    }
                    var qString = "SELECT Name, COUNT(ID) AS lcount FROM TimeSheets WHERE ApprovalStatus='Pending' GROUP BY EmployeeName";
                    QueryDB( qString, req, res, function(tmresult) {
                        if( tmresult.rowsAffected != 0){
                            tmCount = tmresult.rowsAffected.lcount;
                        }

                        if( leaveCount == 0 && tmCount == 0 ){
                            speech = speech + "You have no pending HR activities for today."
                        }
                        else{
                            speech = speech + "You have the following pending activities: "
                            if( leaveCount != 0 ){
                                speech = speech + leaveCount + " Leave requests.\n";
                            }
                            if( tmCount != 0 ){
                                speech = speech + tmCount + " Timesheet requests.\n";
                            }

                        }
                        return res.json({
                          speech: speech,
                          displayText: speech
                        });
                    });

                });
            }
            else{
                var varHost = '';
                var varPath = '';

                console.log( "intentName : " + intentName);
                try
                {
                    if( intentName == 'News' || intentName == 'News - link' ){
                        varHost = 'vikinews.herokuapp.com';
                        varPath = '/inputmsg'; 
                    }

                if( intentName == 'Budget' || intentName == 'Expense' || intentName.indexOf( "DCP -" ) == 0 || intentName.indexOf( "ADS_" ) == 0 || intentName.indexOf( "Hyperion ADS -" ) == 0 || intentName == 'Hyperion - no - yes' || intentName == 'reporting' || intentName.indexOf( "KIR_" ) == 0  || intentName.indexOf( "EPM_" ) == 0 || intentName.indexOf( "BIP_" ) == 0 || intentName.indexOf( "hcm_" ) == 0 ){
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

                    if( intentName.indexOf( "opty_top" ) == 0 ){
                        //varHost = 'polar-sea-99105.herokuapp.com';
                        varHost = 'opty.herokuapp.com';
                        varPath = '/opptytop';
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

        }
    } 
    
  }
  catch(e)
  {
    console.log( "Error : " + e );
  }
}
